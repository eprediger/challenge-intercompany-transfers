import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateTransfer } from 'src/application/domain/entities/create-transfer.entity';
import type { ITransfersService } from 'src/application/ports/in/services/transfer.service.interface';
import { CreateTransferDto } from '../dto/transfer/create-transfer.dto';
import { TransferResponseDto } from '../dto/transfer/transfer-response.dto';
import { CompanyResponseDto } from '../dto/company/company-response.dto';
import { DateRangeParams } from '../dto/date-range-params.dto';

@Controller({
  path: 'transfers',
  version: '1',
})
@ApiTags('Transfers')
export class TransfersController {
  constructor(
    @Inject('ITransfersService') private readonly service: ITransfersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transfer between companies' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: TransferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed for the input data.',
  })
  async create(@Body() dto: CreateTransferDto): Promise<TransferResponseDto> {
    const createTransfer = new CreateTransfer(
      dto.sentDate,
      dto.amount,
      dto.senderId,
      dto.recipientId,
    );

    const transfer = await this.service.create(createTransfer);

    return plainToInstance(TransferResponseDto, transfer, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/companies')
  @ApiOperation({
    summary: 'Get companies that made transfers in a given period of time',
  })
  @ApiResponse({
    status: 200,
    description: 'List of companies filtered by subscription date range.',
    type: [CompanyResponseDto],
  })
  findAll(@Query() query: DateRangeParams) {
    return [];
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  } */
}
