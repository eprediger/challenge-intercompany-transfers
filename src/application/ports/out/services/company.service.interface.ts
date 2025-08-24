import { Company } from 'src/application/domain/entities/company';
import { CreateCompanyDto } from 'src/infrastructure/adapters/in/http/dto/create-company.dto';

export interface ICompanyService {
  create(dto: CreateCompanyDto): Company;
}
