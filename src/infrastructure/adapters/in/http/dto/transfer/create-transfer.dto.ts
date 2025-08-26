import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import type { UUID } from 'node:crypto';

export class CreateTransferDto {
  @ApiProperty({
    description: 'Date when the transfer was sent',
    type: String,
    format: 'date-time',
    example: '2025-08-25T12:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  sentDate: Date;

  @ApiProperty({
    description: 'Amount transferred',
    type: Number,
    example: 1000.5,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    description: 'UUID of the sender company',
    type: String,
    format: 'uuid',
    example: '7e2f0b57-9617-4c50-8405-ecc14940bdf0',
  })
  @IsUUID()
  senderId: UUID;

  @ApiProperty({
    description: 'UUID of the recipient company',
    type: String,
    format: 'uuid',
    example: '5e569f98-5ad5-43d9-9dd9-b86e2e57138b',
  })
  @IsUUID()
  recipientId: UUID;
}
