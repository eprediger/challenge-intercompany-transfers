import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Company } from 'src/application/domain/entities/company';
import type { ICompanyService } from 'src/application/ports/in/services/company.service.interface';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyQueryParams } from '../dto/company-query-params.dto';

@Controller({
  path: 'companies',
  version: '1',
})
@ApiTags('Companies')
export class CompanyController {
  constructor(
    @Inject('ICompanyService') private readonly service: ICompanyService,
  ) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed for the input data.',
  })
  async create(@Body() dto: CreateCompanyDto): Promise<Company> {
    const company = new Company(dto.name, dto.type, dto.subscriptionDate);

    await this.service.create(company);

    const companyResponseDto = plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });

    return companyResponseDto;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of companies filtered by subscription date range.',
    type: [CompanyResponseDto],
  })
  async find(
    @Query() query: CompanyQueryParams,
  ): Promise<CompanyResponseDto[]> {
    const companies = await this.service.find(
      {
        subscriptionDateFrom: query.subscriptionDateFrom,
        subscriptionDateTo: query.subscriptionDateTo
      }
    );
    // Transform to response DTOs
    return companies.map((company) =>
      plainToInstance(CompanyResponseDto, company, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
