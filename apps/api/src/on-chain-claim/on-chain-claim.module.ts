import { Module } from '@nestjs/common';
import { OnChainClaimController } from './on-chain-claim.controller';
import { OnChainClaimService } from './on-chain-claim.service';
import { CommonService } from '../common.service';

@Module({
  controllers: [OnChainClaimController],
  providers: [OnChainClaimService, CommonService],
})
export class OnChainClaimModule {}
