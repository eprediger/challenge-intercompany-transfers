import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { UUID } from 'crypto';
import { CompanyTypes } from 'src/application/domain/company.type';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the company',
    example: 'b3b7c8e2-1f2a-4c3d-9e4f-123456789abc',
    type: 'string',
    format: 'uuid',
  })
  @Expose()
  id: UUID;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Corporation',
  })
  @Expose()
  name: string;

  @ApiProperty({
    enum: CompanyTypes,
    description:
      'Type of the company. Possible values: ' +
      Object.values(CompanyTypes).join(', '),
  })
  @Expose()
  type: CompanyTypes;
}
