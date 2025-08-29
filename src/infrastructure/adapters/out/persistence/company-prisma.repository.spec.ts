import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { randomUUID, UUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company.entity';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { PageOptions } from 'src/application/domain/value-objects/page-options';
import { PrismaModule } from 'src/infrastructure/modules/prisma.module';
import { CompanyPrismaRepository } from './company-prisma.repository';

describe('CompanyPrismaRepository (integration)', () => {
  let repository: CompanyPrismaRepository;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();

    // Clean up the database before running tests
    await prismaClient.transfer.deleteMany();
    await prismaClient.company.deleteMany();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CompanyPrismaRepository],
    }).compile();

    repository = module.get<CompanyPrismaRepository>(CompanyPrismaRepository);
  });

  afterEach(async () => {
    // Clean up after tests
    await prismaClient.transfer.deleteMany();
    await prismaClient.company.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('create', () => {
    it('should create a company in the database and return it', async () => {
      const companyDto = {
        id: randomUUID(),
        name: 'Acme Corp',
        type: CompanyTypes.Pyme,
        subscriptionDate: new Date('2024-06-01T00:00:00Z'),
      };

      const expectedCompany = new Company(
        companyDto.name,
        companyDto.type,
        companyDto.subscriptionDate,
        companyDto.id,
      );

      const actualCompany = await repository.create(expectedCompany);

      // Check that the company exists in the database
      const dbCompany = await prismaClient.company.findUnique({
        where: { id: expectedCompany.id },
      });

      expect(dbCompany).not.toBeNull();

      expect(dbCompany.id).toEqual(expectedCompany.id);
      expect(dbCompany.name).toBe(expectedCompany.name);
      expect(dbCompany.type).toBe(expectedCompany.type);
      expect(dbCompany.subscriptionDate).toEqual(
        expectedCompany.subscriptionDate,
      );

      // The repository should return the same company instance
      expect(actualCompany).toBe(expectedCompany);
    });
  });

  describe('findSubscribed', () => {
    const expectedCompany = new Company(
      'Wonka Industries',
      CompanyTypes.Pyme,
      new Date('2025-08-05T20:00:00.000Z'),
    );

    beforeAll(async () => {
      await Promise.all(
        [
          new Company(
            'Acme Corporation',
            CompanyTypes.Pyme,
            new Date('2025-02-17T14:00:00.000Z'),
          ),
          new Company(
            'Stark Industries',
            CompanyTypes.Corporativa,
            new Date('2025-06-28T09:00:00.000Z'),
          ),
          expectedCompany,
        ].map((company) => repository.create(company)),
      );
    });

    it('should return companies created within a given date range', async () => {
      const subscriptionDateFrom = new Date('2025-07-25T00:00:00.000Z');
      const subscriptionDateTo = new Date('2025-08-25T23:59:59.999Z');

      const dateRange = new DateRange(subscriptionDateFrom, subscriptionDateTo);
      const page = PageOptions.create(1, 1);

      const [actualCompanies, count] = await repository.findSubscribed(
        dateRange,
        page,
      );

      expect(count).toBe(1);
      expect(actualCompanies).toHaveLength(1);
      expect(actualCompanies[0].name).toBe(expectedCompany.name);
      expect(actualCompanies[0].type).toBe(expectedCompany.type);
      expect(actualCompanies[0].subscriptionDate.toISOString()).toBe(
        expectedCompany.subscriptionDate.toISOString(),
      );
    });
  });

  describe('findTransferSenders', () => {
    const senderCompany = new Company(
      'Sender Company',
      CompanyTypes.Pyme,
      new Date('2025-03-10T12:00:00.000Z'),
    );
    const nonSenderCompany = new Company(
      'NonSender Company',
      CompanyTypes.Corporativa,
      new Date('2025-04-15T15:00:00.000Z'),
    );

    beforeAll(async () => {
      // Create companies
      await repository.create(senderCompany);
      await repository.create(nonSenderCompany);

      // Insert a transfer sent by senderCompany within the date range
      await prismaClient.transfer.createMany({
        data: [
          {
            id: randomUUID(),
            amount: 1000,
            sentDate: new Date('2025-08-10T10:00:00.000Z'),
            senderId: senderCompany.id,
            recipientId: nonSenderCompany.id,
          },
          // Insert a transfer sent by nonSenderCompany outside the date range
          {
            id: randomUUID(),
            amount: 600.1,
            sentDate: new Date('2025-08-11T10:00:00.000Z'),
            senderId: nonSenderCompany.id,
            recipientId: senderCompany.id,
          },
        ],
      });
    });

    it('should return companies that sent transfers within the given date range', async () => {
      const from = new Date('2025-07-10T00:00:00.000Z');
      const to = new Date('2025-08-10T23:59:59.999Z');

      const dateRange = new DateRange(from, to);
      const page = PageOptions.create(1, 1);

      const [actualSenders, count] = await repository.findTransferSenders(
        dateRange,
        page,
      );

      expect(count).toBe(1);
      expect(actualSenders).toBeInstanceOf(Array<Company>);

      expect(actualSenders).toHaveLength(1);
      expect(actualSenders[0].id).toBe(senderCompany.id);
      expect(actualSenders[0].name).toBe(senderCompany.name);
      expect(actualSenders[0].type).toBe(senderCompany.type);
      expect(actualSenders[0].subscriptionDate.toISOString()).toBe(
        senderCompany.subscriptionDate.toISOString(),
      );
    });

    it('should return an empty page if no companies sent transfers in the range', async () => {
      const from = new Date('2025-07-09T00:00:00.000Z');
      const to = new Date('2025-08-09T23:59:59.999Z');

      const dateRange = new DateRange(from, to);
      const page = PageOptions.create(1, 1);

      const [senders, count] = await repository.findTransferSenders(
        dateRange,
        page,
      );

      expect(senders).toBeInstanceOf(Array<Company>);
      expect(count).toBe(0);
      expect(senders).toHaveLength(0);
    });
  });

  describe('findById', () => {
    let createdCompany: Company;

    beforeAll(async () => {
      createdCompany = new Company(
        'Umbrella Corp',
        CompanyTypes.Corporativa,
        new Date('2025-09-01T10:00:00.000Z'),
      );
      await repository.create(createdCompany);
    });

    it('should return the company when a valid id is provided', async () => {
      const foundCompany = await repository.findById(createdCompany.id);

      expect(foundCompany).toBeInstanceOf(Company);
      expect(foundCompany.id).toBe(createdCompany.id);
      expect(foundCompany.name).toBe(createdCompany.name);
      expect(foundCompany.type).toBe(createdCompany.type);
      expect(foundCompany.subscriptionDate.toISOString()).toBe(
        createdCompany.subscriptionDate.toISOString(),
      );
    });

    it('should return null when the company id does not exist', async () => {
      const nonExistentId: UUID = '00000000-0000-0000-0000-000000000000';

      const companyOrNull = await repository.findById(nonExistentId);
      expect(companyOrNull).toBeNull();
    });
  });
});
