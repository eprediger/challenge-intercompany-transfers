import { APIGatewayProxyResult } from 'aws-lambda';
import { CompanySubscriptionResponse } from '../../shared/types';

export function createErrorResponse(
  statusCode: number,
  errorCode: string,
  message: string,
  details?: unknown,
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
      },
    }),
  };
}

export function createSuccessResponse(
  requestId: string,
  companyRecord: CompanySubscriptionResponse,
): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
    },
    body: JSON.stringify({
      id: companyRecord.id,
      name: companyRecord.name,
      type: companyRecord.type,
      subscriptionDate: companyRecord.subscriptionDate,
    }),
  };
}
