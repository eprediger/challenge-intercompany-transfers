import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { Company } from '../domain/entities/company.entity';
import { CompanyTypes } from '../domain/company.type';
import type { UUID } from 'node:crypto';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';

describe('CompanyService', () => {
  let service: CompanyService;
  const repoFindByIdMock = jest.fn<Promise<Company | null>, [UUID]>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: 'ICompanyRepository',
          useValue: {
            findById: repoFindByIdMock,
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    const id: UUID = 'b7e3a1c2-4f5d-4e2a-9c1b-2f3e4d5a6b7c';

    it('should return a company from an existing id', async () => {
      const mockCompany = new Company(
        'Test Company',
        CompanyTypes.Pyme,
        new Date(),
        id,
      );

      repoFindByIdMock.mockResolvedValue(mockCompany);

      const actualCompany = await service.findById(id);

      expect(repoFindByIdMock).toHaveBeenCalledWith(id);
      expect(actualCompany).toBe(mockCompany);
    });

    it('should throw EntityNotFoundError if id does not exist', async () => {
      repoFindByIdMock.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(EntityNotFoundError);
    });

    it('should throw an error if repository fails', async () => {
      repoFindByIdMock.mockRejectedValue(new Error('Unknown error'));

      await expect(service.findById(id)).rejects.toThrow();
    });
  });
});
