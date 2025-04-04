export interface BalanceRequest {
  id: number | undefined;
  currencyCode: string | undefined;
  country: string | undefined;
}

export interface BalanceResponse {
  data?: {
    balance?: number;
    profile?: any;
    voice?: any;
    callback?: string;
    recommended_profile?: any;
  };
}
