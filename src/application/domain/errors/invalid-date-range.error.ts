import { DomainError } from './domain.error';

export class InvalidDateRange extends DomainError {
  constructor() {
    super(
      `Invalid date range: date from should come before date to`,
      'INVALID_DATE_RANGE',
    );
  }
}
