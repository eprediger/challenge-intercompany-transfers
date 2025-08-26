import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/entities/company.entity';
import { ICompanyService } from '../ports/in/services/company.service.interface';
import type { ICompanyRepository } from '../ports/out/repositories/company.repository.interface';
import { UUID } from 'crypto';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';

@Injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async create(company: Company): Promise<Company> {
    return this.companyRepository.create(company);
  }

  find(params: {
    subscriptionDateFrom: Date;
    subscriptionDateTo: Date;
  }): Promise<Company[]> {
    return this.companyRepository.find({
      subscriptionDateFrom: params.subscriptionDateFrom,
      subscriptionDateTo: params.subscriptionDateTo,
    });
  }

  async findById(id: UUID): Promise<Company> {
    const companyOrNull = await this.companyRepository.findById(id);

    if (companyOrNull === null) {
      throw new EntityNotFoundError('Company', id);
    }

    return companyOrNull;
  }
}
