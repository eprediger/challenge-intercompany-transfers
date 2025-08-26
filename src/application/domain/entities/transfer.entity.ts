import { UUID, randomUUID } from 'node:crypto';
import { Company } from './company.entity';

export class Transfer {
  public readonly id: UUID;

  constructor(
    public readonly sentDate: Date,
    public readonly amount: number,
    public readonly senderCompany: Company,
    public readonly recipientCompany: Company,
    id?: UUID,
  ) {
    this.id = id || randomUUID();
  }

  get senderCompanyId(): UUID {
    return this.senderCompany.id;
  }
  get recipientCompanyId(): UUID {
    return this.recipientCompany.id;
  }
}
