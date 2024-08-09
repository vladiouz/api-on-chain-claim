// import { Identifier } from './../../../../node_modules/@types/estree/index.d';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import {
  AddressUtils,
  BinaryUtils,
  Locker,
} from '@multiversx/sdk-nestjs-common';
import { TransactionProcessor } from '@multiversx/sdk-transaction-processor';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CacheInfo, CommonConfigService } from '@libs/common';
import { AppConfigService } from '../config/app-config.service';
import { sc_address } from 'apps/api/src/utils';
import { ApiService } from '@multiversx/sdk-nestjs-http';

@Injectable()
export class ProcessorService {
  private transactionProcessor: TransactionProcessor =
    new TransactionProcessor();
  private readonly logger: Logger;

  constructor(
    private readonly cacheService: CacheService,
    private readonly commonConfigService: CommonConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly apiService: ApiService,
  ) {
    this.logger = new Logger(ProcessorService.name);
  }

  @Cron('*/1 * * * * *')
  async handleNewTransactions() {
    await Locker.lock('newTransactions', async () => {
      await this.transactionProcessor.start({
        gatewayUrl: this.commonConfigService.config.urls.api,
        maxLookBehind: this.appConfigService.config.maxLookBehind,
        // eslint-disable-next-line require-await
        onTransactionsReceived: async (
          shardId,
          nonce,
          transactions,
          statistics,
        ) => {
          this.logger.log(
            `Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}`,
          );

          const allInvalidatedKeys = [];

          for (const transcation of transactions) {
            const isOurTransaction = transcation.receiver === sc_address;
            if (isOurTransaction && transcation.status == 'success') {
              const method = transcation.getDataFunctionName();
              switch (method) {
                case 'claim':
                  const claimKey = await this.handleClaimTransaction(
                    transcation,
                  );
                  allInvalidatedKeys.push(claimKey);
                  break;
                case 'claimAndRepair':
                  break;
                case 'updateState':
                  break;
                case 'setRepairStreakPayment':
                  break;
                default:
                  console.log('Unknown method');
                  break;
              }
            }
          }

          const allUniqueInvalidatedKeys = allInvalidatedKeys.distinct();
          if (allUniqueInvalidatedKeys.length > 0) {
            await this.cacheService.deleteMany(allUniqueInvalidatedKeys);
          }
        },
        getLastProcessedNonce: async (shardId) => {
          return await this.cacheService.getRemote(
            CacheInfo.LastProcessedNonce(shardId).key,
          );
        },
        setLastProcessedNonce: async (shardId, nonce) => {
          await this.cacheService.setRemote(
            CacheInfo.LastProcessedNonce(shardId).key,
            nonce,
            CacheInfo.LastProcessedNonce(shardId).ttl,
          );
        },
      });
    });
  }

  private async handleClaimTransaction(transaction: any): Promise<string> {
    const txnUrl = `https://devnet-api.multiversx.com/transactions/${
      transaction.originalTransactionHash ?? transaction.hash
    }`;
    console.log('----------------------', txnUrl);

    const { data: onChainTtransaction } = await this.apiService.get(txnUrl);

    const claimEvent = onChainTtransaction.logs?.events?.find(
      (e: any) => e.identifier === 'claim',
    );
    if (!claimEvent) {
      return '';
    }

    const claimerAddresHex = BinaryUtils.base64ToHex(claimEvent.topics[1]);
    const claimerAddress = AddressUtils.bech32Encode(claimerAddresHex);

    console.log('----------------------', claimerAddress);
    return CacheInfo.AddressInfo(claimerAddress).key;
  }
}
