import { randomUUID, UUID } from 'node:crypto';
import { CompanyTypes } from '../company.type';

export class Company {
  constructor(
    public readonly name: string,
    public readonly type: CompanyTypes,
    public readonly subscriptionDate: Date,
    public readonly id?: UUID,
  ) {
    this.id = id || randomUUID();
  }
}
