import { UUID } from 'node:crypto';

export class CreateTransfer {
  constructor(
    public readonly sentDate: Date,
    public readonly amount: number,
    public readonly senderId: UUID,
    public readonly recipientId: UUID,
  ) {}
}
