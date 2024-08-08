import {
  AbiRegistry,
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
  Token,
  TokenIdentifierValue,
  TokenTransfer,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { CommonService } from '../common.service';
import { sc_address } from '../utils';
import { UpdateStateDto } from './update-state.dto';
import { RepairStreakPaymentDto } from './repair-streak-payment.dto';
import { AddressInfoDto } from './address-info.dto';
import { EsdtTokenPaymentDto } from './esdt-token-payment.dto';

@Injectable()
export class OnChainClaimService {
  constructor(private readonly commonService: CommonService) {}

  async getSmartContract(address: string): Promise<SmartContract> {
    const jsonContent: string = await promises.readFile(
      'apps/api/src/on-chain-claim.abi.json',
      {
        encoding: 'utf8',
      },
    );
    const json = JSON.parse(jsonContent);
    const contract = new SmartContract({
      address: Address.fromBech32(address),
      abi: AbiRegistry.create(json),
    });

    return contract;
  }

  async getClaimTransaction(): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit
      .claim()
      .withChainID('D')
      .withGasLimit(1000000000);
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getClaimAndRepairTransaction(address: string): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const esdtTransfer = await this.getRepairStreakPayment();
    console.log(esdtTransfer);
    console.log(esdtTransfer.token_identifier);
    const interactor = contract.methodsExplicit
      .claimAndRepair()
      .withChainID('D')
      .withGasLimit(1000000000)
      .withSender(Address.fromBech32(address))
      .withSingleESDTTransfer(
        new TokenTransfer({
          token: new Token({
            identifier: esdtTransfer.token_identifier,
            nonce: BigInt(esdtTransfer.token_nonce),
          }),
          amount: BigInt(esdtTransfer.amount),
        }),
      );
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getUpdateStateTransaction(
    updateStateDto: UpdateStateDto,
  ): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const args = [
      new AddressValue(Address.fromBech32(updateStateDto.address)),
      new U64Value(updateStateDto.current_streak),
      new U64Value(updateStateDto.last_epoch_claimed),
      new U64Value(updateStateDto.total_epochs_claimed),
      new U64Value(updateStateDto.best_streak),
    ];
    const interactor = contract.methodsExplicit
      .updateState(args)
      .withChainID('D')
      .withGasLimit(1000000000);
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getSetRepairStreakPayment(
    repairStreakPaymentDto: RepairStreakPaymentDto,
  ): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const args = [
      new TokenIdentifierValue(repairStreakPaymentDto.tokenId),
      new U64Value(repairStreakPaymentDto.amount),
    ];
    const interactor = contract.methodsExplicit
      .setRepairStreakPayment(args)
      .withChainID('D')
      .withGasLimit(1000000000);
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getAddressInfo(address: string): Promise<AddressInfoDto> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.getAddressInfo([
      new AddressValue(Address.fromBech32(address)),
    ]);
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    if (result.firstValue === undefined) {
      return new AddressInfoDto(1, 1, 1, 1);
    }

    return result.firstValue.valueOf();
  }

  async getCanBeRepaired(address: string): Promise<boolean> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.canBeRepaired([
      new AddressValue(Address.fromBech32(address)),
    ]);
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    if (result.firstValue === undefined) {
      return false;
    }

    return result.firstValue.valueOf();
  }

  async getRepairStreakPayment(): Promise<EsdtTokenPaymentDto> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.getRepairStreakPayment();
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    if (result.firstValue === undefined) {
      return new EsdtTokenPaymentDto('1', 1, 1);
    }

    return result.firstValue.valueOf();
  }
}
