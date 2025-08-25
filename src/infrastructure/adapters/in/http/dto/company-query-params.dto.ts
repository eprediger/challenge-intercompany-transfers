import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CompanyQueryParams {
  @ApiProperty({
    name: 'subscription-date-from',
    description:
      'Start of the subscription date range (inclusive). Must be a valid ISO 8601 date string.',
    example: '2025-01-01',
    type: String,
    format: 'date-time',
    required: true,
  })
  @Expose({ name: 'subscription-date-from' })
  @Type(() => Date)
  @IsDate()
  subscriptionDateFrom: Date;

  @ApiProperty({
    name: 'subscription-date-to',
    description:
      'End of the subscription date range (inclusive). Must be a valid ISO 8601 date string.',
    example: '2025-08-25',
    type: String,
    format: 'date-time',
    required: false,
    default: () => new Date().toISOString(),
  })
  @Expose({ name: 'subscription-date-to' })
  @Transform(({ value }) => {
    return value ? new Date(value) : new Date();
  })
  @IsDate()
  subscriptionDateTo: Date;
}
