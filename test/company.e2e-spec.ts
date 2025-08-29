import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CompanyResponseDto } from 'src/infrastructure/adapters/in/http/dto/company/company-response.dto';
import { PageResponseDto } from 'src/infrastructure/adapters/in/http/dto/page-response.dto';
import { PrismaService } from 'src/infrastructure/adapters/out/persistence/prisma.service';
import { validate } from 'src/infrastructure/config/validate';
import { CompanyModule } from 'src/infrastructure/modules/company.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Company Controller (e2e)', () => {
  let app: INestApplication<App>;
  let prismaClient: PrismaClient;

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
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    );

    await app.init();
    prismaClient = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Clean up after tests
    await prismaClient.company.deleteMany();
  });

  describe('Company Creation', () => {
    it('should create a new company', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/companies')
        .send({
          name: 'Company Name',
          type: 'Corporativa',
          subscriptionDate: '2025-08-25T13:47:24.108Z',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
    });

    it.each(['name', 'type', 'subscriptionDate'])(
      'should response bad request for incomplete bodies',
      async (propertyName) => {
        const requestBody = {
          name: 'Company Name',
          type: 'Corporativa',
          subscriptionDate: '2025-08-25T13:47:24.108Z',
        };

        delete requestBody[propertyName];

        const response = await request(app.getHttpServer())
          .post('/v1/companies')
          .send(requestBody);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
    );
  });

  describe('Company Querying', () => {
    const expectedCompany = {
      name: 'Wonka Industries',
      type: 'Pyme',
      subscriptionDate: '2025-08-05T20:00:00.000Z',
    };

    beforeAll(async () => {
      await Promise.all(
        [
          {
            name: 'Acme Corporation',
            type: 'Pyme',
            subscriptionDate: '2025-02-17T14:00:00.000Z',
          },
          {
            name: 'Stark Industries',
            type: 'Corporativa',
            subscriptionDate: '2025-06-28T09:00:00.000Z',
          },
          expectedCompany,
        ].map((company) =>
          request(app.getHttpServer()).post('/v1/companies').send(company),
        ),
      );
    });

    it('should return companies created given a time period', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/companies/subscriptions')
        .query({
          'from-date': '2025-07-25',
          'to-date': '2025-08-25',
        });

      const body = response.body as PageResponseDto<CompanyResponseDto>;
      const companiesDto = body.items;

      expect(response.status).toBe(HttpStatus.OK);
      expect(body).toHaveProperty('items');
      expect(companiesDto).toHaveLength(1);
      expect(companiesDto).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedCompany)]),
      );
    });
    describe('Parameters validations', () => {
      it.todo('should return bad request for an invalid operation');
      it.todo('should return bad request for a non-positive page number');
      it.todo('should return bad request for a non-positive page size');
    });
  });
});
