import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UUID } from 'node:crypto';
import { PrismaService } from './prisma.service';
import { Company } from 'src/application/domain/entities/company.entity';
import { ICompanyRepository } from 'src/application/ports/out/repositories/company.repository.interface';
import { CompanyTypes } from 'src/application/domain/company.type';

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

  async findSubscribed(params: { from: Date; to: Date }): Promise<Company[]> {
    const rows = await this.prismaService.company.findMany({
      where: {
        subscriptionDate: {
          gte: params.from,
          lte: params.to,
        },
      },
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

  async findTransferSenders(params: {
    from: Date;
    to: Date;
  }): Promise<Company[]> {
    const rows = await this.prismaService.company.findMany({
      where: {
        sentTransfers: {
          some: {
            sentDate: {
              gt: params.from,
              lt: params.to,
            },
          },
        },
      },
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
