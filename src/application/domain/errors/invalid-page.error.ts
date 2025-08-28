import { DomainError } from './domain.error';

export type ErrorDetails = {
  field: string;
  code: string;
  message: string;
};

export class InvalidPageError extends DomainError {
  constructor(details: ErrorDetails[]) {
    super('Invalid Page parameters', 'INVALID_PAGE', { details });
  }
}
