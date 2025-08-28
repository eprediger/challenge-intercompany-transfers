import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { Company } from '../domain/entities/company.entity';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { DateRange } from '../domain/value-objects/date-range';
import { Page } from '../domain/value-objects/page';
import { ICompanyService } from '../ports/in/services/company.service.interface';
import type { ICompanyRepository } from '../ports/out/repositories/company.repository.interface';

@Injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async create(company: Company): Promise<Company> {
    return this.companyRepository.create(company);
  }

  findCompaniesSubscribed(
    dateRange: DateRange,
    page: Page,
  ): Promise<Company[]> {
    return this.companyRepository.findSubscribed(dateRange, page);
  }

  findTransferSenders(dateRange: DateRange, page: Page): Promise<Company[]> {
    return this.companyRepository.findTransferSenders(dateRange, page);
  }

  async findById(id: UUID): Promise<Company> {
    const companyOrNull = await this.companyRepository.findById(id);

    if (companyOrNull === null) {
      throw new EntityNotFoundError('Company', id);
    }

    return companyOrNull;
  }
}
