import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import type { UUID } from 'node:crypto';
import { CompanyResponseDto } from '../company/company-response.dto';
import { Transfer } from 'src/application/domain/entities/transfer.entity';

export class TransferResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the company',
    example: 'b3b7c8e2-1f2a-4c3d-9e4f-123456789abc',
    type: 'string',
    format: 'uuid',
  })
  @Expose()
  id: UUID;

  @ApiProperty({
    description:
      'Date when the transfer was sent. Must be a valid ISO 8601 date string.',
    example: '2024-06-01T00:00:00.000Z',
  })
  @Expose()
  sentDate: Date;

  @ApiProperty({
    description: 'Amount transferred',
    type: Number,
    example: 1000.5,
    minimum: 0.01,
  })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Sender company of the transfer',
    type: () => CompanyResponseDto,
  })
  @Expose({ name: 'senderCompany' })
  @Transform(({ obj }: { obj: Transfer }) => obj.senderCompany)
  senderCompany: CompanyResponseDto;

  @ApiProperty({
    description: 'Recipient company of the transfer',
    type: () => CompanyResponseDto,
  })
  @Expose({ name: 'recipientCompany' })
  @Transform(({ obj }: { obj: Transfer }) => obj.recipientCompany)
  recipientCompany: CompanyResponseDto;
}
