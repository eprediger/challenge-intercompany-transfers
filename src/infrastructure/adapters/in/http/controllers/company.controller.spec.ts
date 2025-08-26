import { Test, TestingModule } from '@nestjs/testing';
import { CompanyTypes } from 'src/application/domain/company.type';
import { CompanyController } from './company.controller';

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
            create: jest.fn(),
            findTransferSenders: jest.fn(),
            findCompaniesSubscribed: jest.fn(),
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
