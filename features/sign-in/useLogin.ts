import React, { useCallback, useRef, useEffect } from "react";
import {
  LoginParams,
  LoginResponse,
} from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";

// Servicios y hooks
import api from "@/config/api";
import { useAuth } from "@/context/auth";
import { getSubscriberData } from "@/api/subscriberApi";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { createSubscriber } from "@/api/subscriberApi";

/**
 * Realiza la petición al backend para iniciar sesión.
 */
export async function login(body: LoginParams): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/signIn", body);
  return response.data;
}

/**
 * Hook personalizado para manejar el login de la SIM.
 */
export function useLogin() {
  const auth = useAuth();
  const uuid = useDeviceUUID(); 
  const uuidRef = useRef(uuid);

  useEffect(() => {
    uuidRef.current = uuid;
  }, [uuid]);

  const loginRequest = useCallback(async (id, code, name) => {
    if (!uuidRef.current) {
      console.warn("⛔ UUID aún no disponible.");
      return { error: "UUID aún no está listo. Intenta de nuevo." };
    }

    try {
      console.log("🔐 LoginRequest → SIM:", id);
      console.log("📱 LoginRequest → UUID:", uuidRef.current);

      const loginRes = await login({ id, code });
      console.log("🔑 LoginResponse:", loginRes);

      if (loginRes.status === "fail") {
        return { error: "Login fallido o sin datos válidos" };
      }

      let subscriberRes;

      try {
        subscriberRes = await getSubscriberData(id.toString(), uuidRef.current);
      } catch (err) {
        console.warn("🆕 SIM no registrada, creando...");

        const result = await createSubscriber({
          iccid: id.toString(),
          provider: "telco-vision",
          name,
          uuid: uuidRef.current,
        });

        if (result?.code === "duplicate_iccid" || result?.status === "success") {
          subscriberRes = await getSubscriberData(id.toString(), uuidRef.current);
        } else {
          throw new Error("❌ No se pudo registrar la SIM.");
        }
      }

      const validProviders = subscriberRes?.providers?.filter(Boolean) || [];
      const firstProvider = validProviders?.[0];

      auth?.signIn(
        {
          simName: name,
          idSim: id,
          code,
        },
        validProviders,
        firstProvider?.balance
      );

      return {
        data: loginRes,
        error: null,
      };
    } catch (err) {
      console.error("🔥 Error general en loginRequest:", err);
      return { error: err };
    }
  },
  [uuid, auth]); 

  return { loginRequest };
}


