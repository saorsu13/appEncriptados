import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { BalanceRequest } from "./types";
import { setLoading } from "@/features/loading/loadingSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import useModalAll from "@/hooks/useModalAll";
import { useTranslation } from "react-i18next";
import { setInsufficientFunds } from "./insufficientFundsSlice";
import { setBalance } from "./balanceSlice";

export async function getSimBalance(body: BalanceRequest): Promise<any> {
  try {
    const response = await api.post("/getSimBalance", {
      id: body.id,
      currency_code: body.currencyCode,
      country: body.country,
    });

    return response;
  } catch (error) {
    throw error;
  }
}
