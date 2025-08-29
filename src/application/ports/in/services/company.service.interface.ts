import { UUID } from 'node:crypto';
import { Company } from 'src/application/domain/entities/company.entity';

export interface ICompanyService {
  /**
   * Creates a new company.
   * @param company The company entity to create.
   * @returns The created company.
   */
  create(company: Company): Promise<Company>;

  /**
   * Finds a company by its unique identifier.
   * @param id The UUID of the company.
   * @returns The company with the given id.
   * @throws {EntityNotFoundError} If the company with the given id is not found.
   */
  findById(id: UUID): Promise<Company>;
}
