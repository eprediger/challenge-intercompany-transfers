import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Company } from 'src/application/domain/entities/company.entity';
import {
  OPERATION_TYPES,
  type OperationTypes,
} from 'src/application/domain/operation.type';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { Page } from 'src/application/domain/value-objects/page';
import type { ICompanyService } from 'src/application/ports/in/services/company.service.interface';
import { CompanyResponseDto } from '../dto/company/company-response.dto';
import { CreateCompanyDto } from '../dto/company/create-company.dto';
import { DateRangeParams } from '../dto/date-range-params.dto';
import { PageOptionsDto } from '../dto/page-options.dto';

@Controller({
  path: 'companies',
  version: '1',
})
@ApiTags('Companies')
export class CompanyController {
  private readonly operations: Record<
    OperationTypes,
    (dateRange: DateRange, page: Page) => Promise<Company[]>
  >;

  constructor(
    @Inject('ICompanyService') private readonly service: ICompanyService,
  ) {
    this.operations = {
      transfers: this.service.findTransferSenders.bind(this.service),
      subscriptions: this.service.findCompaniesSubscribed.bind(this.service),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Subscribe a new company' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The company has been successfully created.',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
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

  @Get(':operation')
  @ApiOperation({
    summary:
      'Get companies that subscribed or made transfers in a given period of time',
  })
  @ApiParam({
    name: 'operation',
    enum: Object.values(OPERATION_TYPES),
    enumName: 'OperationTypes',
    required: true,
    description:
      'The operation to perform: "subscriptions" for companies that subscribed in a period, "transfers" for companies that made transfers in a period.',
    example: 'subscriptions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of companies filtered by subscription date range.',
    type: [CompanyResponseDto],
  })
  async find(
    @Param('operation') operation: OperationTypes,
    @Query() query: DateRangeParams,
    @Query() pagination: PageOptionsDto,
  ): Promise<CompanyResponseDto[]> {
    const dateRange = new DateRange(query.fromDate, query.toDate);
    const page = Page.create(pagination.page, pagination.take);

    const companies = await this.operations[operation](dateRange, page);

    return companies.map((c) =>
      plainToInstance(CompanyResponseDto, c, { excludeExtraneousValues: true }),
    );
  }
}
