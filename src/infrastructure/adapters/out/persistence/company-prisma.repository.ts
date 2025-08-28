import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company.entity';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { ICompanyRepository } from 'src/application/ports/out/repositories/company.repository.interface';
import { PrismaService } from './prisma.service';
import { Page } from 'src/application/domain/value-objects/page';

@Injectable()
export class CompanyPrismaRepository implements ICompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(company: Company): Promise<Company> {
    const companyCreateInput: Prisma.CompanyCreateInput = {
      id: company.id,
      name: company.name,
      type: company.type,
      subscriptionDate: company.subscriptionDate,
    };
    await this.prismaService.company.create({ data: companyCreateInput });

    return company;
  }

  async findSubscribed(dateRange: DateRange, page: Page): Promise<Company[]> {
    const rows = await this.prismaService.company.findMany({
      where: {
        subscriptionDate: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      skip: page.skip,
      take: page.size,
    });

    return rows.map(
      (row) =>
        new Company(
          row.name,
          row.type as CompanyTypes,
          row.subscriptionDate,
          row.id as UUID,
        ),
    );
  }

  async findTransferSenders(
    dateRange: DateRange,
    page: Page,
  ): Promise<Company[]> {
    const rows = await this.prismaService.company.findMany({
      where: {
        sentTransfers: {
          some: {
            sentDate: {
              gt: dateRange.from,
              lt: dateRange.to,
            },
          },
        },
      },
      skip: page.skip,
      take: page.size,
    });

    return rows.map(
      (row) =>
        new Company(
          row.name,
          row.type as CompanyTypes,
          row.subscriptionDate,
          row.id as UUID,
        ),
    );
  }

  async findById(id: UUID): Promise<Company | null> {
    const row = await this.prismaService.company.findUnique({ where: { id } });

    if (row) {
      return new Company(
        row.name,
        row.type as CompanyTypes,
        row.subscriptionDate,
        row.id as UUID,
      );
    }

    return null;
  }
}
