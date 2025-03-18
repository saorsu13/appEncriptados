import api from "@/config/api";

interface ConversionRates {
  [key: string]: number;
}

interface ExchangeRatesResponse {
  base_code: string;
  conversion_rates: ConversionRates;
  documentation: string;
  result: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
}

export const getCurrency = async (): Promise<ExchangeRatesResponse> => {
  try {
    const response = await api.get<ExchangeRatesResponse>("/getCurrencies");
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      base_code: "",
      conversion_rates: {},
      documentation: "",
      result: "error",
      terms_of_use: "",
      time_last_update_unix: 0,
      time_last_update_utc: "",
      time_next_update_unix: 0,
      time_next_update_utc: "",
    };
  }
};

export interface BalanceResponse {
  status: string;
  balance: number;
  balance_internet: number;
  balance_minutes: number;
  balance_imsi_changes: number;
  currency_code: string;
}

export const getCurrentBalanceByCurrency = async (
  idSim?: number | string,
  code?: string
): Promise<BalanceResponse | null> => {
  if (!idSim || !code) {
    console.warn("getCurrentBalanceByCurrency: idSim o currency_code no válidos");
    return null;
  }

  try {
    const response = await api.get<BalanceResponse>(
      `/changeBalanceForCurrencySelected?id=${idSim}&currency_code=${code}`
    );
    return response.data;
  } catch (error) {
    console.error("Error en getCurrentBalanceByCurrency:", error);
    throw error; // Permite que useQuery maneje el error
  }
};

