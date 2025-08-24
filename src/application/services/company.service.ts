import { Injectable } from '@nestjs/common';
import { ICompanyService } from '../ports/out/services/company.service.interface';
import { CreateCompanyDto } from 'src/infrastructure/adapters/in/http/dto/create-company.dto';
import { Company } from '../domain/entities/company';

@Injectable()
export class CompanyService implements ICompanyService {
  constructor() {}

  create(dto: CreateCompanyDto): Company {
    return new Company(dto.name, dto.type);
  }
}
