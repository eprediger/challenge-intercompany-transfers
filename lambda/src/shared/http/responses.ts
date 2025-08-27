import { APIGatewayProxyResult } from 'aws-lambda';

export function createErrorResponse(
  statusCode: number,
  errorCode: string,
  message: string,
  details?: any,
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
