import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company';
import { CompanyPrismaRepository } from './company-prisma.repository';
import { PrismaService } from './prisma.service';

describe('CompanyPrismaRepository (integration)', () => {
  let repository: CompanyPrismaRepository;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyPrismaRepository,
        {
          provide: PrismaService,
          useValue: {
            company: prismaClient.company,
          },
        },
      ],
    }).compile();

    repository = module.get<CompanyPrismaRepository>(CompanyPrismaRepository);
  });

  beforeEach(async () => {
    // Clean up the database before running tests
    await prismaClient.company.deleteMany();
  });

  afterEach(async () => {
    // Clean up after tests
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
});
