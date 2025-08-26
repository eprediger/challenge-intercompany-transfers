import { UUID } from 'node:crypto';
import { Company } from 'src/application/domain/entities/company.entity';

export interface ICompanyService {
  create(dto: Company): Promise<Company>;
  find(params: {
    subscriptionDateFrom: Date;
    subscriptionDateTo: Date;
  }): Promise<Company[]>;
  findById(id: UUID): Promise<Company>;
}
