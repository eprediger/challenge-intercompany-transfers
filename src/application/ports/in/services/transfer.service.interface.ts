import { CreateTransfer } from 'src/application/domain/entities/create-transfer.entity';
import { Transfer } from 'src/application/domain/entities/transfer.entity';

export interface ITransfersService {
  /**
   * Creates a new transfer.
   * @param transfer The transfer data to create.
   * @returns The created transfer entity.
   */
  create(transfer: CreateTransfer): Promise<Transfer>;
}
