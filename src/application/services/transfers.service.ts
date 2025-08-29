import { Inject, Injectable } from '@nestjs/common';
import { CreateTransfer } from '../domain/entities/create-transfer.entity';
import { Transfer } from '../domain/entities/transfer.entity';
import type { ICompanyService } from '../ports/in/services/company.service.interface';
import { ITransfersService } from '../ports/in/services/transfer.service.interface';
import type { ITransferRepository } from '../ports/out/repositories/transfer.repository.interface';

@Injectable()
export class TransfersService implements ITransfersService {
  constructor(
    @Inject('ITransferRepository')
    private readonly repository: ITransferRepository,
    @Inject('ICompanyService')
    private readonly companyService: ICompanyService,
  ) {}

  async create(createTransfer: CreateTransfer): Promise<Transfer> {
    const [senderCompany, recipientCompany] = await Promise.all([
      this.companyService.findById(createTransfer.senderId),
      this.companyService.findById(createTransfer.recipientId),
    ]);

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
