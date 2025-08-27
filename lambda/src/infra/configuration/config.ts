interface EnvironmentConfig {
  readonly API_BASE_URL: string;
  readonly API_POST_COMPANY_ROUTE: string;
  readonly API_TIMEOUT: number;
}

export const getEnvironmentConfig: () => EnvironmentConfig = () => ({
  API_BASE_URL: process.env.API_BASE_URL || '',
  API_POST_COMPANY_ROUTE: process.env.API_POST_COMPANY_ROUTE || '',
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
});
