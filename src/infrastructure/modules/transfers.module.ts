import { Module } from '@nestjs/common';
import { TransfersService } from 'src/application/services/transfers.service';
import { TransfersController } from '../adapters/in/http/controllers/transfers.controller';
import { CompanyModule } from './company.module';
import { TransferPrismaRepository } from '../adapters/out/persistence/transfer-prisma.repository';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [CompanyModule, PrismaModule],
  controllers: [TransfersController],
  providers: [
    {
      provide: 'ITransfersService',
      useClass: TransfersService,
    },
    {
      provide: 'ITransferRepository',
      useClass: TransferPrismaRepository,
    },
  ],
})
export class TransfersModule {}
