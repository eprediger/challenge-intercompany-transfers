import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from 'src/application/domain/entities/company';
import type { ICompanyService } from 'src/application/ports/out/services/company.service.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { plainToInstance } from 'class-transformer';
import { CompanyResponseDto } from '../dto/company-response.dto';

@Controller({
  path: 'companies',
  version: '1',
})
@ApiTags('Companies')
export class CompanyController {
  constructor(
    @Inject('ICompanyService') private readonly service: ICompanyService,
  ) {}

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
    const company = this.service.create(dto);

    const companyResponseDto = plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });

    return companyResponseDto;
  }
}
