import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from 'src/application/domain/entities/company';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { plainToInstance } from 'class-transformer';
import { CompanyResponseDto } from '../dto/company-response.dto';
import type { ICompanyService } from 'src/application/ports/in/services/company.service.interface';

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
  create(@Body() dto: CreateCompanyDto): Company {
    const company = new Company(dto.name, dto.type);

    this.service.create(company);

    const companyResponseDto = plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });

    return companyResponseDto;
  }
}
