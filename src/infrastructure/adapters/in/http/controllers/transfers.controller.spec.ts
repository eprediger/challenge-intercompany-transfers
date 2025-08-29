import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransfer } from 'src/application/domain/entities/create-transfer.entity';
import { TransfersController } from './transfers.controller';

describe('TransfersController', () => {
  let controller: TransfersController;
  const createTransferMock = jest.fn<
    Promise<CreateTransfer>,
    [CreateTransfer]
  >();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: 'ITransfersService',
          useValue: {
            create: createTransferMock,
          },
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
