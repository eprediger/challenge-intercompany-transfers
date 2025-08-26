import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/entities/company.entity';
import { ICompanyService } from '../ports/in/services/company.service.interface';
import type { ICompanyRepository } from '../ports/out/repositories/company.repository.interface';
import { UUID } from 'crypto';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { DateRange } from '../domain/value-objects/date-range';

@Injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async create(company: Company): Promise<Company> {
    return this.companyRepository.create(company);
  }

  findCompaniesSubscribed(dateRange: DateRange): Promise<Company[]> {
    return this.companyRepository.findSubscribed(dateRange);
  }

  findTransferSenders(dateRange: DateRange): Promise<Company[]> {
    return this.companyRepository.findTransferSenders(dateRange);
  }

  async findById(id: UUID): Promise<Company> {
    const companyOrNull = await this.companyRepository.findById(id);

    if (companyOrNull === null) {
      throw new EntityNotFoundError('Company', id);
    }

    return companyOrNull;
  }
}
