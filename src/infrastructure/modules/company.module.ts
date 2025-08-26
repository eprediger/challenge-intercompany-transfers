import { Module } from '@nestjs/common';
import { CompanyService } from 'src/application/services/company.service';
import { CompanyController } from '../adapters/in/http/controllers/company.controller';
import { PrismaModule } from './prisma.module';
import { CompanyPrismaRepository } from '../adapters/out/persistence/company-prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: 'ICompanyService',
      useClass: CompanyService,
    },
    {
      provide: 'ICompanyRepository',
      useClass: CompanyPrismaRepository,
    },
  ],
  exports: [
    {
      provide: 'ICompanyService',
      useClass: CompanyService,
    },
  ],
})
export class CompanyModule {}
