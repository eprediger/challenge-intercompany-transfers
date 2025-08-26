import { CreateTransfer } from 'src/application/domain/entities/create-transfer.entity';
import { Transfer } from 'src/application/domain/entities/transfer.entity';

export interface ITransfersService {
  create(transfer: CreateTransfer): Promise<Transfer>;
  // findAll(): Promise<Transfer[]>;
  // findOne(id: UUID): Promise<Transfer>;
}
