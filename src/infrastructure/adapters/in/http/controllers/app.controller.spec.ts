import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'IAppService',
          useValue: {
            getHello: () => 'Hello World!'
          }
        }
      ],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
