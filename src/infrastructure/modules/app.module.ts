import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validate';
import { CompanyModule } from './company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CompanyModule
  ],
})
export class AppModule { }
