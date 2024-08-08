import { Constants } from '@multiversx/sdk-nestjs-common';

export class CacheInfo {
  key: string = '';
  ttl: number = Constants.oneSecond() * 6;

  static LastProcessedNonce(shardId: number): CacheInfo {
    return {
      key: `lastProcessedNonce:${shardId}`,
      ttl: Constants.oneMonth(),
    };
  }

  static Examples: CacheInfo = {
    key: 'examples',
    ttl: Constants.oneHour(),
  };

  static RepairStreakPayment(): CacheInfo {
    return {
      key: 'repairStreakPayment',
      ttl: Constants.oneHour(),
    };
  }

  static CanBeRepaired(address: string): CacheInfo {
    return {
      key: `canBeRepaired:${address}`,
      ttl: Constants.oneHour(),
    };
  }

  static AddressInfo(address: string): CacheInfo {
    return {
      key: `addressInfo:${address}`,
      ttl: Constants.oneHour(),
    };
  }
}
