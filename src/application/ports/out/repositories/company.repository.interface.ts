import { UUID } from 'node:crypto';
import { Company } from 'src/application/domain/entities/company.entity';

export interface ICompanyRepository {
  create(company: Company): Promise<Company>;
  find(params: {
    subscriptionDateFrom: Date;
    subscriptionDateTo: Date;
  }): Promise<Company[]>;
  findById(id: UUID): Promise<Company | null>;
}
