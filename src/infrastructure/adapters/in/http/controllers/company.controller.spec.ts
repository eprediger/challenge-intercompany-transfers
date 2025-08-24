import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyTypes } from 'src/application/domain/company.type';
import { CompanyService } from 'src/application/services/company.service';

describe('AppController', () => {
  let app: TestingModule;
  let controller: CompanyController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: 'ICompanyService',
          useClass: CompanyService,
        },
      ],
    }).compile();

    controller = app.get(CompanyController);
  });

  describe('Company creation', () => {
    it.each([
      {
        name: 'Acme Corporation',
        type: CompanyTypes.PYME,
      },
      {
        name: 'Stark Industries',
        type: CompanyTypes.CORPORATIVA,
      },
    ])('should return a new company', (companyDto) => {
      const result = controller.create(companyDto);

      expect(result).toHaveProperty('id');
      expect(result).toMatchObject(companyDto);
    });
  });
});
