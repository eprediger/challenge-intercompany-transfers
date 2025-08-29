import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { Company } from 'src/application/domain/entities/company.entity';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { PageOptions } from 'src/application/domain/value-objects/page-options';
import { ICompanyRepository } from 'src/application/ports/out/repositories/company.repository.interface';
import { PrismaService } from './prisma.service';

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

  async findSubscribed(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]> {
    const where = {
      subscriptionDate: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    } satisfies Prisma.CompanyWhereInput;
    const [rows, count] = await this.prismaService.$transaction([
      this.prismaService.company.findMany({
        where,
        skip: page.skip,
        take: page.size,
      }),
      this.prismaService.company.count({
        where,
      }),
    ]);

    return this.createPage(rows, count);
  }

  async findTransferSenders(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]> {
    const where = {
      sentTransfers: {
        some: {
          sentDate: {
            gt: dateRange.from,
            lt: dateRange.to,
          },
        },
      },
    } satisfies Prisma.CompanyWhereInput;

    const [rows, count] = await this.prismaService.$transaction([
      this.prismaService.company.findMany({
        where,
        skip: page.skip,
        take: page.size,
      }),
      this.prismaService.company.count({
        where,
      }),
    ]);

    return this.createPage(rows, count);
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

  private createPage(
    rows: {
      id: string;
      name: string;
      type: $Enums.CompanyType;
      subscriptionDate: Date;
    }[],
    count: number,
  ): [Company[], number] {
    const companies = rows.map(
      (row) =>
        new Company(
          row.name,
          row.type as CompanyTypes,
          row.subscriptionDate,
          row.id as UUID,
        ),
    );

    return [companies, count];
  }
}
