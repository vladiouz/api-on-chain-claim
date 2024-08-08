import { Module } from '@nestjs/common';
import { OnChainClaimController } from './on-chain-claim.controller';
import { OnChainClaimService } from './on-chain-claim.service';
import { CommonService } from '../common.service';
import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import { RedisCacheModule } from '@multiversx/sdk-nestjs-cache';

@Module({
  imports: [
    MetricsModule,
    RedisCacheModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [OnChainClaimController],
  providers: [OnChainClaimService, CommonService],
})
export class OnChainClaimModule {}
