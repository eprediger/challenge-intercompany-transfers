export const OPERATION_TYPES = ['transfers', 'subscriptions'] as const;

export type OperationTypes = (typeof OPERATION_TYPES)[number];
