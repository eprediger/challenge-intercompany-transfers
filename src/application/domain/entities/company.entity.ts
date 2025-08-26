import { randomUUID, UUID } from 'node:crypto';
import { CompanyTypes } from '../company.type';

export class Company {
  public readonly id: UUID;

  constructor(
    public readonly name: string,
    public readonly type: CompanyTypes,
    public readonly subscriptionDate: Date,
    id?: UUID,
  ) {
    this.id = id || randomUUID();
  }
}
