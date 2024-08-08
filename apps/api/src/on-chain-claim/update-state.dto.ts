export class UpdateStateDto {
  address: string;
  current_streak: number;
  last_epoch_claimed: number;
  total_epochs_claimed: number;
  best_streak: number;

  constructor(
    address: string,
    current_streak: number,
    last_epoch_claimed: number,
    total_epochs_claimed: number,
    best_streak: number,
  ) {
    this.address = address;
    this.current_streak = current_streak;
    this.last_epoch_claimed = last_epoch_claimed;
    this.total_epochs_claimed = total_epochs_claimed;
    this.best_streak = best_streak;
  }
}
