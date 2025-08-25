import { Company } from 'src/application/domain/entities/company';

export interface ICompanyService {
  create(dto: Company): Promise<Company>;
}
