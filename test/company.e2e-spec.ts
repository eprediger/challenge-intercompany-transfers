import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { validate } from 'src/infrastructure/config/validate';
import { CompanyModule } from 'src/infrastructure/modules/company.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('CompanyController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          validate,
        }),
        CompanyModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  it('should create a new company', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/companies')
      .send({
        name: 'Company Name',
        type: 'Corporativa',
      });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('id');
  });

  it.each(['name', 'type'])(
    'should response bad request for incomplete bodies',
    async (propertyName) => {
      const requestBody = {
        name: 'Company Name',
        type: 'Corporativa',
      };

      delete requestBody[propertyName];

      const response = await request(app.getHttpServer())
        .post('/v1/companies')
        .send(requestBody);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    },
  );
});
