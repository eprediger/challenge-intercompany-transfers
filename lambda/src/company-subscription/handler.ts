import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { createCompany } from '../infra/http/request-handler';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../infra/http/responses';
import { CompanySubscriptionResponse } from '../shared/types';
import { validateCompanySubscription } from '../shared/validation';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const requestId = context.awsRequestId;

  try {
    const companySubscriptionRequest: unknown = event.body
      ? JSON.parse(event.body)
      : undefined;
    try {
      validateCompanySubscription(companySubscriptionRequest);
    } catch {
      return createErrorResponse(
        400,
        'INVALID_JSON',
        'The request body is not valid JSON',
      );
    }

    const { data } = await createCompany(companySubscriptionRequest);

    const responseRecord: CompanySubscriptionResponse = {
      id: data.id,
      name: data.name,
      type: data.type,
      subscriptionDate: data.subscriptionDate,
    };
    return createSuccessResponse(requestId, responseRecord);
  } catch (error: unknown) {
    console.error('Error processing adhesion:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(500, 'INTERNAL_ERROR', message);
  }
};
