import { Module } from '@nestjs/common';
import { CompanyService } from 'src/application/services/company.service';
import { CompanyController } from '../adapters/in/http/controllers/company.controller';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: 'ICompanyService',
      useClass: CompanyService
    }
  ],
})
export class CompanyModule { }
