import { Module } from '@nestjs/common';
import { EndpointsModule } from './endpoints/endpoints.module';
import { DynamicModuleUtils } from '@libs/common';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';
import { CommonConfigModule } from '@libs/common/config/common.config.module';
import { AppConfigModule } from './config/app-config.module';
import { OnChainClaimModule } from './on-chain-claim/on-chain-claim.module';

@Module({
  imports: [
    LoggingModule,
    EndpointsModule,
    AppConfigModule,
    CommonConfigModule,
    OnChainClaimModule,
  ],
  providers: [DynamicModuleUtils.getNestJsApiConfigService()],
})
export class PublicAppModule {}
