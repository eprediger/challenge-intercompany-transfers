import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DateRangeParams {
  @ApiProperty({
    name: 'from-date',
    description:
      'Start of the date range. Must be a valid ISO 8601 date string.',
    example: '2025-01-01',
    type: String,
    format: 'date-time',
    required: true,
  })
  @Expose({ name: 'from-date' })
  @Type(() => Date)
  @IsDate()
  fromDate: Date;

  @ApiPropertyOptional({
    name: 'to-date',
    description: 'End of the date range. Must be a valid ISO 8601 date string.',
    example: '2025-08-25',
    type: String,
    format: 'date-time',
    default: () => new Date().toISOString(),
  })
  @Expose({ name: 'to-date' })
  @Transform(({ value }: { value: string }) => {
    return value ? new Date(value) : new Date();
  })
  @IsDate()
  toDate: Date;
}
