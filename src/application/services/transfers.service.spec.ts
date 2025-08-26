import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { UUID } from 'crypto';
import { CompanyTypes } from '../domain/company.type';
import { Company } from '../domain/entities/company.entity';
import { CreateTransfer } from '../domain/entities/create-transfer.entity';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { Transfer } from '../domain/entities/transfer.entity';

describe('TransfersService', () => {
  let service: TransfersService;
  const companyFindByIdMock = jest.fn<Promise<Company>, [UUID]>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: 'ITransferRepository',
          useValue: {
            create: jest.fn<Promise<Transfer>, [Transfer]>(),
          },
        },
        {
          provide: 'ICompanyService',
          useValue: {
            findById: companyFindByIdMock,
          },
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const senderId: UUID = 'b7e6a1c2-3f4d-4e2a-8b1a-2c3d4e5f6a7b';
    const recipientId: UUID = 'c8f7b2d3-4e5f-5a6b-9c2d-3e4f5a6b7c8d';

    const expectedSenderCompany = new Company(
      'Sender',
      CompanyTypes.Pyme,
      new Date('2024-01-01'),
      senderId,
    );
    const expectedRecipientCompany = new Company(
      'Recipient',
      CompanyTypes.Corporativa,
      new Date('2024-02-01'),
      recipientId,
    );

    const expectedSendDate = new Date('2024-06-01T12:00:00Z');
    const expectedAmount = 1000;

    const createTransfer = new CreateTransfer(
      expectedSendDate,
      expectedAmount,
      senderId,
      recipientId,
    );

    afterEach(() => {
      companyFindByIdMock.mockClear();
    });

    it('should create a transfer when both companies exist', async () => {
      companyFindByIdMock.mockImplementation(async (id: UUID) => {
        if (id === senderId) return Promise.resolve(expectedSenderCompany);
        if (id === recipientId)
          return Promise.resolve(expectedRecipientCompany);
        throw new EntityNotFoundError(Company.name, id);
      });

      const actualTransfer = await service.create(createTransfer);

      expect(companyFindByIdMock).toHaveBeenCalledTimes(2);

      expect(actualTransfer.sentDate).toBe(expectedSendDate);
      expect(actualTransfer.amount).toBe(expectedAmount);
      expect(actualTransfer.senderCompany).toStrictEqual(expectedSenderCompany);
      expect(actualTransfer.recipientCompany).toStrictEqual(
        expectedRecipientCompany,
      );

      expect(actualTransfer).toHaveProperty('id');
    });

    it.skip('should throw an error if one or both companies do not exist', async () => {
      // Arrange: sender exists, recipient does not
      companyFindByIdMock.mockImplementationOnce(async (id: UUID) => {
        if (id === senderId) return Promise.resolve(expectedSenderCompany);
        throw new Error('not found');
      });
      companyFindByIdMock.mockImplementationOnce((_id: UUID) => {
        throw new Error('not found');
      });

      // Act & Assert
      await expect(service.create(createTransfer)).rejects.toThrow(
        'One or more companies not found',
      );
      expect(companyFindByIdMock).toHaveBeenCalledTimes(2);
    });

    it.skip('should throw an error if one of the findById calls fails (promise rejected)', async () => {
      // Arrange: sender resolves, recipient rejects
      companyFindByIdMock.mockImplementationOnce(async (id: UUID) => {
        if (id === senderId) return Promise.resolve(expectedSenderCompany);
        throw new Error('not found');
      });
      companyFindByIdMock.mockImplementationOnce((_id: UUID) => {
        throw new Error('Database error');
      });

      // Act & Assert
      await expect(service.create(createTransfer)).rejects.toThrow(
        'One or more companies not found',
      );
      expect(companyFindByIdMock).toHaveBeenCalledTimes(2);
    });
  });
});
