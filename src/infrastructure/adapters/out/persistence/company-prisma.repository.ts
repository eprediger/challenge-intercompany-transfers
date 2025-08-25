import { Injectable } from "@nestjs/common";
import { Company } from "src/application/domain/entities/company";
import { ICompanyRepository } from "src/application/ports/out/repositories/company.repository.interface";
import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class CompanyPrismaRepository implements ICompanyRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async create(company: Company): Promise<Company> {
    const companyCreateInput: Prisma.CompanyCreateInput = {
      id: company.id,
      name: company.name,
      type: company.type,
    }
    await this.prismaService.company.create({ data: companyCreateInput });

    return company;
  }
}
