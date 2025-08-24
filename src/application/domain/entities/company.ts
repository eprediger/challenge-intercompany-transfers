import { CompanyTypes } from "../company.type";

export class Company {
  static ID: number = 1;

  public readonly id: number;

  constructor(
    public readonly name: string,
    public readonly type: CompanyTypes
  ) {
    this.id = Company.ID++;
  }
}
