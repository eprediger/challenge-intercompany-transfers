import { DomainError } from './domain.error';

export abstract class InvalidEntityError extends DomainError {
  constructor(message: string, code: string, context: Record<string, any>) {
    super(message, code, context);
  }
}
