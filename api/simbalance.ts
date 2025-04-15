import api from "@/config/api";

interface ConversionRates {
  [key: string]: number;
}

export interface ExchangeRatesResponse {
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
export interface Currency {
  isoCode: string;
  label: string;
  value: string;
}
export const getCurrency = async (): Promise<Currency[]> => {
  try {
    console.log("🌐 getCurrency → llamando a /getCurrencies");
    const response = await api.get<Currency[]>("/getCurrencies");
    return response.data;
  } catch (error) {
    console.error("🌐 getCurrency → error:", error);
    return [];
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
  id?: number | string,
  code?: string
): Promise<BalanceResponse | null> => {
  console.log("🧪 Entrando a getCurrentBalanceByCurrency");
  console.log("📥 id recibido:", id, "| tipo:", typeof id);
  console.log("📥 code recibido:", code, "| tipo:", typeof code);

  if (!id || !code) {
    console.warn(
      "⚠️ getCurrentBalanceByCurrency: idSim o currency_code no válidos",
      { id, code }
    );
    return null;
  }

  const url = `/changeBalanceForCurrencySelected?id=${id}&currency_code=${code}`;
  console.log("🌐 URL construida:", url);

  try {
    const response = await api.get<BalanceResponse>(url);
    console.log("📤 Response status:", response.status);
    console.log("📤 Response data:", response.data);
    console.log("📤 Tipo de respuesta:", typeof response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en getCurrentBalanceByCurrency:", error.message || error);
    if (error.response) {
      console.error("❌ Error response data:", error.response.data);
    }
    throw error;
  }
};
