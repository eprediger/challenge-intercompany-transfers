import { Transfer } from 'src/application/domain/entities/transfer.entity';

export interface ITransferRepository {
  /**
   * Creates a new transfer entity in the repository.
   * @param transfer The transfer entity to create.
   * @returns The created transfer entity.
   */
  create(transfer: Transfer): Promise<Transfer>;
}
