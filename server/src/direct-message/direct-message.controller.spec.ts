import { Test, TestingModule } from '@nestjs/testing';
import { DirectMessageController } from './direct-message.controller';

describe('DirectMessageController', () => {
  let controller: DirectMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectMessageController],
    }).compile();

    controller = module.get<DirectMessageController>(DirectMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
