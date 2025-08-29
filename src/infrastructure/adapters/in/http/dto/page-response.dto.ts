import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetadataDto } from './page-metadata.dto';

@ApiSchema({ name: 'Page Response' })
export class PageResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  public readonly items: T[];

  @ApiProperty({ type: PageMetadataDto })
  public readonly metadata: PageMetadataDto;
}
