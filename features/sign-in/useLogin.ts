import {
  LoginParams,
  LoginResponse,
} from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";
import api from "@/config/api";
import { useAuth } from "@/context/auth";
import { getSubscriberData } from "@/api/subscriberApi";

export async function login(body: LoginParams): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/signIn", body);
  
  return response.data;
}

export function useLogin() {
  const auth = useAuth();
  
  async function loginRequest(id: number, code: number, name: string) {
    try {
      const loginRes = await login({ id, code });

      if (
        loginRes.ok &&
        loginRes.data &&
        loginRes?.data?.["status"] !== "fail"
      ) {
        const subscriberRes = await getSubscriberData(id.toString());
        const validProviders = subscriberRes?.providers?.filter(Boolean) || [];
        const firstProvider = validProviders?.[0];

        auth?.signIn(
          {
            simName: name,
            idSim: id,
            code: code,
          },
          validProviders,
          firstProvider?.balance
        );

        return {
          data: loginRes.data,
          error: null,
        };
      }

      return { error: loginRes.originalError?.code };
    } catch (err) {
      return { error: err };
    }
  }

  return { loginRequest };
}

