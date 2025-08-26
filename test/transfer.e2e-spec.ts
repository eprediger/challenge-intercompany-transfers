import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UUID } from 'node:crypto';
import { CompanyTypes } from 'src/application/domain/company.type';
import { PrismaService } from 'src/infrastructure/adapters/out/persistence/prisma.service';
import { validate } from 'src/infrastructure/config/validate';
import { TransfersModule } from 'src/infrastructure/modules/transfers.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('TransfersController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          validate,
        }),
        TransfersModule,
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
    await prismaClient.transfer.deleteMany();
    await prismaClient.company.deleteMany();
  });

  describe('POST /v1/transfers', () => {
    it('should return 422 when sender company does not exist', async () => {
      const recipientCompanyId: UUID = 'c8f7b2d3-4e5f-5a6b-9c2d-3e4f5a6b7c8d';
      const recipientCompany = await prismaClient.company.create({
        data: {
          id: recipientCompanyId,
          name: 'Recipient Company',
          type: CompanyTypes.Pyme,
          subscriptionDate: new Date('2024-01-01T00:00:00Z'),
        },
      });

      // Use a non-existent sender company id
      // Use a valid UUID that is different from the recipientCompanyId and does not exist in the database
      const nonExistentSenderId = 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d';

      const transferPayload = {
        sentDate: '2025-08-26T18:15:47.356Z',
        amount: 1000,
        senderId: nonExistentSenderId,
        recipientId: recipientCompany.id,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/transfers')
        .send(transferPayload);

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.headers['content-type']).toMatch(
        /application\/problem\+json/i,
      );
      expect(response.body?.detail).toMatch(/Company with id/i);
    });
  });
});
