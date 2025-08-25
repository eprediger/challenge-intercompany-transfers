import { Test, TestingModule } from '@nestjs/testing';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company';
import { CompanyPrismaRepository } from './company-prisma.repository';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { randomUUID, UUID } from 'node:crypto';

describe('CompanyPrismaRepository (integration)', () => {
  let repository: CompanyPrismaRepository;
  let prismaService: PrismaService;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();
    // Optionally, clean up the database before running tests
    await prismaClient.company.deleteMany();

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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up after tests
    await prismaClient.company.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('create', () => {
    it('should create a company in the database and return it', async () => {
      const expectedCompanyId: UUID = randomUUID();
      const expectedCompanyName = 'Acme Corp';
      const expectedCompanyType = CompanyTypes.Pyme;
      const expectedCompany = new Company(expectedCompanyName, expectedCompanyType, expectedCompanyId);

      const actualCompany = await repository.create(expectedCompany);

      // Check that the company exists in the database
      const dbCompany = await prismaClient.company.findUnique({
        where: { id: expectedCompany.id },
      });

      expect(dbCompany).not.toBeNull();
      expect(dbCompany.id).toBe(expectedCompanyId);
      expect(dbCompany.name).toBe(expectedCompanyName);
      expect(dbCompany.type).toBe(expectedCompanyType);

      // The repository should return the same company instance
      expect(actualCompany).toBe(expectedCompany);
    });
  });
});
