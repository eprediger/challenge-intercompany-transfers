import { Injectable } from '@nestjs/common';
import { IAppService } from '../ports/out/services/app.service.interface';

@Injectable()
export class AppService implements IAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
