import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { ICompanyService } from 'src/application/ports/out/services/company.service.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { Company } from 'src/application/domain/entities/company';


@Controller()
export class CompanyController {
  constructor(@Inject('ICompanyService') private readonly service: ICompanyService) { }

  @Post()
  create(@Body() dto: CreateCompanyDto): Company {
    return this.service.create(dto);
  }
}
