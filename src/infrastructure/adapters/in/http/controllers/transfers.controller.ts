import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateTransfer } from 'src/application/domain/entities/create-transfer.entity';
import type { ITransfersService } from 'src/application/ports/in/services/transfer.service.interface';
import { ProblemResponseDto } from '../dto/company/problem-response.dto';
import { CreateTransferDto } from '../dto/transfer/create-transfer.dto';
import { TransferResponseDto } from '../dto/transfer/transfer-response.dto';
import { EntityNotFoundExceptionFilter } from '../filters/entity-not-found-exception.filter';

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
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    type: TransferResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Validation failed for the input data.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Unprocessable Entity. One of the referenced companies ids do not exist.',
    type: ProblemResponseDto,
  })
  @UseFilters(EntityNotFoundExceptionFilter)
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
}
