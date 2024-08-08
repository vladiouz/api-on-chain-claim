export class RepairStreakPaymentDto {
  tokenId: string;
  amount: number;

  constructor(tokenId: string, amount: number) {
    this.tokenId = tokenId;
    this.amount = amount;
  }
}
