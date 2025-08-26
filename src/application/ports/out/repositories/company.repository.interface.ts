import { UUID } from 'node:crypto';
import { Company } from 'src/application/domain/entities/company.entity';

export interface ICompanyRepository {
  /**
   * Creates a new company entity in the repository.
   * @param company The company entity to create.
   * @returns The created company entity.
   */
  create(company: Company): Promise<Company>;

  /**
   * Finds companies that subscribed within a given date range.
   * @param params The date range with 'from' and 'to' properties.
   * @returns An array of companies subscribed in the given period.
   */
  findSubscribed(params: { from: Date; to: Date }): Promise<Company[]>;

  /**
   * Finds companies that sent transfers within a given date range.
   * @param params The date range with 'from' and 'to' properties.
   * @returns An array of companies that sent transfers in the given period.
   */
  findTransferSenders(params: { from: Date; to: Date }): Promise<Company[]>;

  /**
   * Finds a company by its unique identifier.
   * @param id The UUID of the company.
   * @returns The company with the given id, or null if no such company exists.
   */
  findById(id: UUID): Promise<Company | null>;
}
