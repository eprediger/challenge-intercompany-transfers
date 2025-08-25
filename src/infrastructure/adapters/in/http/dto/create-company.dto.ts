import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyTypes } from 'src/application/domain/company.type';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: CompanyTypes,
    description:
      'Type of the company. Possible values: ' +
      Object.values(CompanyTypes).join(', '),
  })
  @IsEnum(CompanyTypes)
  type: CompanyTypes;

  @ApiProperty({
    description:
      'Date when the company was created or joined. Must be a valid ISO 8601 date string.',
    example: '2025-08-25T13:47:24.108Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  subscriptionDate: Date;
}
