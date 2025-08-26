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

  // const senderId: UUID = 'b7e6a1c2-3f4d-4e2a-8b1a-2c3d4e5f6a7b';
  // const recipientId: UUID = 'c8f7b2d3-4e5f-5a6b-9c2d-3e4f5a6b7c8d';
  // const transferDto = {
  //   sentDate: new Date('2024-06-01T12:00:00Z'),
  //   amount: 1000,
  //   senderId,
  //   recipientId,
  // };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
