import { Test, TestingModule } from '@nestjs/testing';
import { OnChainClaimService } from './on-chain-claim.service';

describe('OnChainClaimService', () => {
  let service: OnChainClaimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnChainClaimService],
    }).compile();

    service = module.get<OnChainClaimService>(OnChainClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
