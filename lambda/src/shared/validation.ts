import { CompanySubscriptionRequest } from './types';

type ValidationError = {
  field: string;
  error: string;
};

export class ValidationErrors extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationErrors);
    }
  }
}

/**
 * Validate shape; throws ValidationErrors on failure
 * @param data to validate
 * @returns CompanySubscriptionRequest
 */
export function validateCompanySubscription(
  data: unknown,
): asserts data is CompanySubscriptionRequest {
  const errors: ValidationError[] = [];

  const obj = data as Record<string, unknown> | null;
  if (!obj || typeof obj !== 'object') {
    throw new ValidationErrors([
      { field: 'body', error: 'Body must be a JSON object' },
    ]);
  }

  if (
    !('name' in obj) ||
    typeof obj.name !== 'string' ||
    obj.name.length === 0
  ) {
    errors.push({
      field: 'name',
      error: 'Name is required and must be a string',
    });
  }

  if (
    !('type' in obj) ||
    typeof obj.type !== 'string' ||
    !['Pyme', 'Corporativa'].includes(obj.type)
  ) {
    errors.push({
      field: 'type',
      error: 'Type must be "Pyme" or "Corporativa"',
    });
  }

  if (
    !('subscriptionDate' in obj) ||
    !isValidISO8601(obj.subscriptionDate as string)
  ) {
    errors.push({
      field: 'subscriptionDate',
      error: 'Invalid date format. Expected format: ISO 8601',
    });
  }

  if (errors.length > 0) {
    throw new ValidationErrors(errors);
  }
}

// Checks if the input is a valid ISO8601 date string
function isValidISO8601(date: string): boolean {
  if (typeof date !== 'string') return false;
  // ISO8601 regex (YYYY-MM-DD or extended with time)
  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|([+-]\d{2}:\d{2})))?$/;
  if (!iso8601Regex.test(date)) return false;
  const parsed = Date.parse(date);
  return !isNaN(parsed);
}
