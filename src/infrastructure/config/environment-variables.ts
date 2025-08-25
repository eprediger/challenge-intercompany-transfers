import { Transform } from 'class-transformer';
import { IsInt, IsString, Matches, Max, Min } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  readonly NODE_ENV: string;

  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  @Max(65535)
  readonly PORT: number;

  @IsString()
  @IsString()
  @Matches(/^file:\.\/\w+\.db$/, { message: 'DATABASE_URL must match the pattern file:./<name>.db' })
  readonly DATABASE_URL: string;
}
