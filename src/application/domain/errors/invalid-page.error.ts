import { DomainError } from './domain.error';
import { ErrorDetails } from './error-details.type';

export class InvalidPageError extends DomainError {
  constructor(details: ErrorDetails[]) {
    super('Invalid Page parameters', 'INVALID_PAGE', { details });
  }
}
