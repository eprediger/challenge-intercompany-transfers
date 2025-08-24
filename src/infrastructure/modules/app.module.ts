import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validate';
import { AppService } from 'src/application/services/app.service';
import { AppController } from '../adapters/in/http/controllers/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'IAppService',
      useClass: AppService
    }
  ],
})
export class AppModule { }
