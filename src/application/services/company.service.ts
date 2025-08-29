import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { Company } from '../domain/entities/company.entity';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { DateRange } from '../domain/value-objects/date-range';
import { PageOptions } from '../domain/value-objects/page-options';
import { ICompanyService } from '../ports/in/services/company.service.interface';
import { ICompanyQueryService } from '../ports/in/services/company.query.service.interface';
import type { ICompanyRepository } from '../ports/out/repositories/company.repository.interface';

@Injectable()
export class CompanyService implements ICompanyService, ICompanyQueryService {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async create(company: Company): Promise<Company> {
    return this.companyRepository.create(company);
  }

  async findById(id: UUID): Promise<Company> {
    const companyOrNull = await this.companyRepository.findById(id);

    if (companyOrNull === null) {
      throw new EntityNotFoundError('Company', id);
    }

    return companyOrNull;
  }

  findCompaniesSubscribed(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]> {
    return this.companyRepository.findSubscribed(dateRange, page);
  }

  findTransferSenders(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]> {
    return this.companyRepository.findTransferSenders(dateRange, page);
  }
}
