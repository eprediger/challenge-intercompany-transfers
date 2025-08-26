import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from './prisma.service';
import { Transfer } from 'src/application/domain/entities/transfer.entity';
import { ITransferRepository } from 'src/application/ports/out/repositories/transfer.repository.interface';

@Injectable()
export class TransferPrismaRepository implements ITransferRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(transfer: Transfer): Promise<Transfer> {
    const data: Prisma.TransferCreateInput = {
      id: transfer.id,
      sentDate: transfer.sentDate,
      amount: new Decimal(transfer.amount),
      sender: { connect: { id: transfer.senderCompanyId } },
      recipient: { connect: { id: transfer.recipientCompanyId } },
    };

    await this.prismaService.transfer.create({ data });

    return transfer;
  }
}
