export class EsdtTokenPaymentDto {
  token_identifier: string;
  token_nonce: number;
  amount: number;

  constructor(token_identifier: string, token_nonce: number, amount: number) {
    this.token_identifier = token_identifier;
    this.token_nonce = token_nonce;
    this.amount = amount;
  }
}
