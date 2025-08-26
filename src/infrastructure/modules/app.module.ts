import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validate';
import { CompanyModule } from './company.module';
import { TransfersModule } from './transfers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CompanyModule,
    TransfersModule,
  ],
})
export class AppModule {}
