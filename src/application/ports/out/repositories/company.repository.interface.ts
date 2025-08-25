import { Company } from "src/application/domain/entities/company";

export interface ICompanyRepository {
    create(company: Company): Promise<Company>;
}
