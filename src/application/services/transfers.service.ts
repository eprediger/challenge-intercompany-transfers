import { Inject, Injectable } from '@nestjs/common';
import { CreateTransfer } from '../domain/entities/create-transfer.entity';
import type { ICompanyService } from '../ports/in/services/company.service.interface';
import { ITransfersService } from '../ports/in/services/transfer.service.interface';
import { Transfer } from '../domain/entities/transfer.entity';
import type { ITransferRepository } from '../ports/out/repositories/transfer.repository.interface';

@Injectable()
export class TransfersService implements ITransfersService {
  constructor(
    @Inject('ITransferRepository')
    private readonly repository: ITransferRepository,
    @Inject('ICompanyService') private readonly companyService: ICompanyService,
  ) {}
  async create(createTransfer: CreateTransfer): Promise<Transfer> {
    const companyPromises = await Promise.allSettled([
      this.companyService.findById(createTransfer.senderId),
      this.companyService.findById(createTransfer.recipientId),
    ]);
    const failed = companyPromises
      .filter((result) => result.status === 'rejected')
      .map((e) => e.reason);

    if (failed.length > 0) {
      // TODO: throw domain error
      throw new Error('One or more companies not found');
    }

    const [senderCompany, recipientCompany] = companyPromises
      .filter((p) => p.status === 'fulfilled')
      .map((c) => c.value);

    const transfer = new Transfer(
      createTransfer.sentDate,
      createTransfer.amount,
      senderCompany,
      recipientCompany,
    );

    await this.repository.create(transfer);

    return transfer;
  }
}
