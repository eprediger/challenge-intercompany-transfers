import { Controller, Get, Inject } from '@nestjs/common';
import type { IAppService } from 'src/application/ports/out/services/app.service.interface';


@Controller()
export class AppController {
  constructor(@Inject('IAppService') private readonly appService: IAppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
