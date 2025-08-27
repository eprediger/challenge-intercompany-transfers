import { request } from 'node:http';
import { URL } from 'node:url';
import { getEnvironmentConfig } from '../configuration/config';
import {
  CompanySubscriptionRequest,
  CompanySubscriptionResponse,
} from '../../shared/types';

export function createCompany(
  company: CompanySubscriptionRequest,
): Promise<{ statusCode: number; data: CompanySubscriptionResponse }> {
  const companyRecord = {
    name: company.name,
    type: company.type,
    subscriptionDate: company.subscriptionDate,
  };

  const { API_POST_COMPANY_ROUTE } = getEnvironmentConfig();

  return makeHttpRequest<CompanySubscriptionResponse>(
    'POST',
    API_POST_COMPANY_ROUTE,
    companyRecord,
  );
}

function makeHttpRequest<T>(
  method: string,
  url: string,
  data: any,
): Promise<{ statusCode: number; data: T }> {
  const { API_BASE_URL } = getEnvironmentConfig();

  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${API_BASE_URL}/${url}`);
    const postData = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData: unknown = responseData
            ? JSON.parse(responseData)
            : undefined;
          resolve({
            statusCode: res.statusCode || 500,
            data: parsedData as T,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Failed to parse response';
          reject(new HttpRequestError(message, res.statusCode));
        }
      });
    });

    req.on('error', (error) => {
      reject(new HttpRequestError(`HTTP request failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new HttpRequestError('Request timeout'));
    });

    req.setTimeout(10000); // 10 second timeout
    req.write(postData);
    req.end();
  });
}

class HttpRequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'HttpRequestError';
  }
}
