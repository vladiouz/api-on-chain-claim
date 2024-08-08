import { Test, TestingModule } from '@nestjs/testing';
import { OnChainClaimController } from './on-chain-claim.controller';

describe('OnChainClaimController', () => {
  let controller: OnChainClaimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnChainClaimController],
    }).compile();

    controller = module.get<OnChainClaimController>(OnChainClaimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
