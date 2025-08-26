import { DomainError } from './domain.error';
import type { UUID } from 'node:crypto';

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: UUID) {
    super(
      `${entityName} with id ${id} not found`,
      `${entityName.toUpperCase()}_NOT_FOUND`,
      { id },
    );
  }
}
