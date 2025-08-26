import { Transfer } from 'src/application/domain/entities/transfer.entity';

export interface ITransferRepository {
  create(company: Transfer): Promise<Transfer>;
}
