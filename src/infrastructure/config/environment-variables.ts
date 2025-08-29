import { IsPort, IsString, Matches } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  readonly NODE_ENV: string;

  @IsPort()
  readonly PORT: string;

  @IsString()
  @IsString()
  @Matches(/^file:\.\/\w+\.db$/, {
    message: 'DATABASE_URL must match the pattern file:./<name>.db',
  })
  readonly DATABASE_URL: string;
}
