import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company.entity';
import { PrismaService } from './prisma.service';
import { TransferPrismaRepository } from './transfer-prisma.repository';
import { Transfer } from 'src/application/domain/entities/transfer.entity';

describe('TransferPrismaRepository (integration)', () => {
  let repository: TransferPrismaRepository;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();

    // Clean up the database before running tests
    await prismaClient.transfer.deleteMany();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferPrismaRepository,
        {
          provide: PrismaService,
          useValue: {
            transfer: prismaClient.transfer,
          },
        },
      ],
    }).compile();

    repository = module.get<TransferPrismaRepository>(TransferPrismaRepository);
  });

  afterEach(async () => {
    // Clean up after tests
    await prismaClient.transfer.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('create', () => {
    it('should create a transfer in the database and return it', async () => {
      // Arrange: create two companies in the database
      const senderCompanyId: UUID = 'b7e6a1c2-3f4d-4e2a-8b1a-2c3d4e5f6a7b';
      const recipientCompanyId: UUID = 'c8f7b2d3-4e5f-5a6b-9c2d-3e4f5a6b7c8d';

      const expectedSenderCompanyName = 'Sender Company';
      await prismaClient.company.create({
        data: {
          id: senderCompanyId,
          name: expectedSenderCompanyName,
          type: CompanyTypes.Pyme,
          subscriptionDate: new Date('2024-01-01T00:00:00Z'),
        },
      });

      await prismaClient.company.create({
        data: {
          id: recipientCompanyId,
          name: 'Recipient Company',
          type: CompanyTypes.Corporativa,
          subscriptionDate: new Date('2024-02-01T00:00:00Z'),
        },
      });

      const expectedSentDate = new Date('2024-06-01T12:00:00Z');
      const expectedAmount = 1234.56;

      const senderCompany = new Company(
        expectedSenderCompanyName,
        CompanyTypes.Pyme,
        new Date('2024-01-01T00:00:00Z'),
        senderCompanyId,
      );
      const recipientCompany = new Company(
        'Recipient Company',
        CompanyTypes.Corporativa,
        new Date('2024-02-01T00:00:00Z'),
        recipientCompanyId,
      );

      const transfer = new Transfer(
        expectedSentDate,
        expectedAmount,
        senderCompany,
        recipientCompany,
      );
      const expectedTransferId = transfer.id;

      // Act
      const actual = await repository.create(transfer);

      // Assert: check the returned transfer
      expect(actual).toBeDefined();
      expect(actual.id).toBe(expectedTransferId);
      expect(actual.sentDate).toEqual(expectedSentDate);
      expect(actual.amount).toBe(expectedAmount);
      expect(actual.senderCompany).toStrictEqual(senderCompany);
      expect(actual.recipientCompany).toStrictEqual(recipientCompany);

      // Assert: check the transfer exists in the database
      const dbTransfer = await prismaClient.transfer.findUnique({
        where: { id: expectedTransferId },
      });

      expect(dbTransfer).not.toBeNull();
      expect(dbTransfer?.id).toBe(expectedTransferId);
      expect(new Date(dbTransfer.sentDate)).toEqual(expectedSentDate);
      expect(Number(dbTransfer.amount)).toBeCloseTo(expectedAmount);
      expect(dbTransfer.senderId).toBe(senderCompanyId);
      expect(dbTransfer.recipientId).toBe(recipientCompanyId);
    });
  });
});
