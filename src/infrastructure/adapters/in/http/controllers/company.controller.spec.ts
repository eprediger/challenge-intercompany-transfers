import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyTypes } from 'src/application/domain/company.type';
import { CompanyService } from 'src/application/services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';

describe('AppController', () => {
  let app: TestingModule;
  let controller: CompanyController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: 'ICompanyService',
          useValue: {
            create: jest.fn()
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
      },
      {
        name: 'Stark Industries',
        type: CompanyTypes.Corporativa,
      },
    ])('should return a new company', (companyDto) => {
      const result = controller.create(companyDto);

      expect(result).toHaveProperty('id');
      expect(result).toMatchObject(companyDto);
    });
  });
});
