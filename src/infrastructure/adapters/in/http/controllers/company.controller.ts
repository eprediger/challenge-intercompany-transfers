import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Company } from 'src/application/domain/entities/company.entity';
import {
  OPERATION_TYPES,
  type OperationTypes,
} from 'src/application/domain/operation.type';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { PageOptions } from 'src/application/domain/value-objects/page-options';
import type { ICompanyService } from 'src/application/ports/in/services/company.service.interface';
import { ApiPaginatedResponse } from '../decorators/api-paginated-response';
import { CompanyResponseDto } from '../dto/company/company-response.dto';
import { CreateCompanyDto } from '../dto/company/create-company.dto';
import { DateRangeParams } from '../dto/date-range-params.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageResponseDto } from '../dto/page-response.dto';
import type { ICompanyQueryService } from 'src/application/ports/in/services/company.query.service.interface';

@Controller({
  path: 'companies',
  version: '1',
})
@ApiTags('Companies')
export class CompanyController {
  private readonly operations: Record<
    OperationTypes,
    (dateRange: DateRange, page: PageOptions) => Promise<[Company, number]>
  >;

  constructor(
    @Inject('ICompanyService') private readonly service: ICompanyService,
    @Inject('ICompanyQueryService')
    private readonly queryService: ICompanyQueryService,
  ) {
    this.operations = {
      transfers: this.queryService.findTransferSenders.bind(this.service),
      subscriptions: this.queryService.findCompaniesSubscribed.bind(
        this.service,
      ),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Subscribe a new company' })
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    type: CompanyResponseDto,
  })
  @ApiBadRequestResponse({
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
  @ApiPaginatedResponse(CompanyResponseDto)
  async find(
    @Param('operation') operation: OperationTypes,
    @Query() query: DateRangeParams,
    @Query() pagination: PageOptionsDto,
  ): Promise<PageResponseDto<CompanyResponseDto>> {
    const dateRange = new DateRange(query.fromDate, query.toDate);
    const pageOptions = PageOptions.create(pagination.page, pagination.take);

    const [companies, count] = await this.operations[operation](
      dateRange,
      pageOptions,
    );

    const totalPages = Math.ceil(count / pageOptions.size);
    const plainCompanies = instanceToPlain(companies);

    return plainToInstance(PageResponseDto<CompanyResponseDto>, {
      items: plainCompanies,
      metadata: {
        count,
        totalPages: totalPages,
        page: pageOptions.number,
        size: pageOptions.size,
        hasPreviousPage: pageOptions.number > 1,
        hasNextPage: pageOptions.number < totalPages,
      },
    });
  }
}
