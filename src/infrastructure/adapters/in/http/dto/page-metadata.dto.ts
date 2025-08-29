import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Page Metadata Response' })
export class PageMetadataDto {
  @ApiProperty({
    description: 'Number of items in the current page',
    example: 10,
    type: Number,
  })
  public readonly count: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 5,
    type: Number,
  })
  public readonly totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: false,
    type: Boolean,
  })
  public readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
    type: Boolean,
  })
  public readonly hasNextPage: boolean;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  public readonly page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  public readonly size: number;
}
