import { Test, TestingModule } from '@nestjs/testing';
import { CompanyTypes } from 'src/application/domain/company.type';
import { CompanyController } from './company.controller';
import { Company } from 'src/application/domain/entities/company.entity';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { PageOptions } from 'src/application/domain/value-objects/page-options';

describe('CompanyController', () => {
  let app: TestingModule;
  let controller: CompanyController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: 'ICompanyService',
          useValue: {
            create: jest.fn<Promise<Company>, [Company]>(),
          },
        },
        {
          provide: 'ICompanyQueryService',
          useValue: {
            findTransferSenders: jest.fn<
              Promise<[Company[], number]>,
              [dateRange: DateRange, page: PageOptions]
            >(),
            findCompaniesSubscribed: jest.fn<
              Promise<[Company[], number]>,
              [dateRange: DateRange, page: PageOptions]
            >(),
          },
        },
      ],
    }).compile();

    controller = app.get(CompanyController);
  });

  describe('Company creation', () => {
    it.each([
      {
        name: 'Acme Corporation',
        type: CompanyTypes.Pyme,
        subscriptionDate: new Date(),
      },
      {
        name: 'Stark Industries',
        type: CompanyTypes.Corporativa,
        subscriptionDate: new Date(),
      },
    ])('should return a new company', async (companyDto) => {
      const result = await controller.create(companyDto);

      expect(result).toHaveProperty('id');
      expect(result).toMatchObject(companyDto);
    });
  });
});
