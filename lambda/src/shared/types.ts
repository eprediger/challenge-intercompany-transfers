type CompanyType = 'Pyme' | 'Corporativa';

export type CompanySubscriptionRequest = {
  name: string;
  type: CompanyType;
  subscriptionDate: string;
};

export type CompanySubscriptionResponse = {
  id: string;
  name: string;
  type: string;
  subscriptionDate: string;
};
