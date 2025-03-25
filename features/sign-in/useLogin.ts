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
      const response = await login({ id, code });
      if (
        response.ok &&
        response.data &&
        response?.data?.["status"] != "fail"
      ) {
        const providers = await getSubscriberData(id.toString());
        const validProviders = providers?.filter(Boolean) || [];

        auth?.signIn({
          simName: name,
          idSim: id,
          code: code,
        },
        validProviders
      );

        return {
          data: response.data,
          error: null,
        };
      }

      return { error: response.originalError.code };
    } catch (err) {
      return { error: err };
    }
  }

  return { loginRequest };
}
