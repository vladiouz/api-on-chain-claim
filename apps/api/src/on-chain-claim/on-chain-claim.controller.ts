import { Body, Controller, Get, Param } from '@nestjs/common';
import { OnChainClaimService } from './on-chain-claim.service';
import { UpdateStateDto } from './update-state.dto';
import { RepairStreakPaymentDto } from './repair-streak-payment.dto';
import { AddressInfoDto } from './address-info.dto';
import { EsdtTokenPaymentDto } from './esdt-token-payment.dto';

@Controller('on-chain-claim')
export class OnChainClaimController {
  constructor(private readonly onChainClaimService: OnChainClaimService) {}

  @Get('/transaction/claim')
  async getClaimTransaction() {
    const transaction = await this.onChainClaimService.getClaimTransaction();
    return transaction.toPlainObject();
  }

  @Get('/transaction/claim-and-repair/:address')
  async getClaimAndRepairTransaction(@Param('address') address: string) {
    const transaction =
      await this.onChainClaimService.getClaimAndRepairTransaction(address);
    return transaction.toPlainObject();
  }

  @Get('/transaction/update-state')
  async getUpdateStateTransaction(@Body() updateStateDto: UpdateStateDto) {
    const transaction =
      await this.onChainClaimService.getUpdateStateTransaction(updateStateDto);
    return transaction.toPlainObject();
  }

  @Get('/transaction/set-repair-streak-payment')
  async getSetRepairStreakPayment(
    @Body() repairStreakPaymentDto: RepairStreakPaymentDto,
  ) {
    const transaction =
      await this.onChainClaimService.getSetRepairStreakPayment(
        repairStreakPaymentDto,
      );
    return transaction.toPlainObject();
  }

  @Get('/get-address-info/:address')
  async getAddressInfo(
    @Param('address') address: string,
  ): Promise<AddressInfoDto> {
    const value = await this.onChainClaimService.getAddressInfo(address);
    return value;
  }

  @Get('/can-be-repaired/:address')
  async getCanBeRepaired(@Param('address') address: string): Promise<boolean> {
    const value = await this.onChainClaimService.getCanBeRepaired(address);
    return value;
  }

  @Get('/repair-streak-payment')
  async getRepairStreakPayment(): Promise<EsdtTokenPaymentDto> {
    const value = await this.onChainClaimService.getRepairStreakPayment();
    return value;
  }
}
