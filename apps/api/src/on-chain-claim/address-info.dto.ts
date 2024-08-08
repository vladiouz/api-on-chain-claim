export class AddressInfoDto {
  currentStreak: number;
  lastEpochClaimed: number;
  totalEpochsClaimed: number;
  bestStreak: number;

  constructor(
    currentStreak: number,
    lastEpochClaimed: number,
    totalEpochsClaimed: number,
    bestStreak: number,
  ) {
    this.currentStreak = currentStreak;
    this.lastEpochClaimed = lastEpochClaimed;
    this.totalEpochsClaimed = totalEpochsClaimed;
    this.bestStreak = bestStreak;
  }
}
