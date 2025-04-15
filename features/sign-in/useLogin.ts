import React, { useCallback, useRef, useEffect } from "react";
import {
  LoginParams,
  LoginResponse,
} from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";

// Servicios y hooks
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/config/api";
import { useAuth } from "@/context/auth";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { getDeviceUUID } from "@/utils/getUUID";

import {
  createSubscriber,
  getSubscriberData,
  listSubscriber,
} from "@/api/subscriberApi";

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
  // const uuid = useDeviceUUID();
  // const uuidRef = useRef(uuid);

  // useEffect(() => {
  //   uuidRef.current = uuid;
  // }, [uuid]);

  const loginRequest = useCallback(
    async (id, code, nameFromInput) => {
      const uuid = await getDeviceUUID();

      if (!uuid || uuid.includes("unknown")) {
        return { error: "UUID aún no está listo. Intenta de nuevo." };
      }

      try {
        const loginRes = await login({ id, code });
        if (loginRes.status === "fail") {
          return { error: "Login fallido o sin datos válidos" };
        }

        const subscriberRes = await getSubscriberData(id.toString(), uuid);
        if (!subscriberRes || typeof subscriberRes !== "object" || !subscriberRes.providers || !subscriberRes.providers.length) {
          return { error: "No se encontró información para esta SIM." };
        }

        const providerData = subscriberRes.providers[0]?.provider;
        const backendIccid = subscriberRes.providers[0]?.iccid;
        const backendImsi = subscriberRes.providers[0]?.imsi;
        const balance = subscriberRes.providers[0]?.balance;

        if (!providerData || (!backendIccid && !backendImsi)) {
          return { error: "SIM inválida o sin información suficiente." };
        }

        const inputIsIccid = id.toString().length === 19;
        const defaultName = inputIsIccid ? "Sim Tim" : "Sim Encr";
        const finalIdSim = inputIsIccid ? subscriberRes?.providers?.[0]?.iccid : subscriberRes?.providers?.[0]?.imsi;

        let sims = [];
        try {
          const simListRes = await listSubscriber(uuid);
          if (Array.isArray(simListRes)) sims = simListRes;
        } catch {
          console.warn("ℹ️ No se pudo listar las SIMs asociadas.");
        }

        const simExists = sims.some((sim) => sim.iccid === backendIccid);
        const simLimitReached = sims.length >= 5;

        if (!simExists && !simLimitReached) {
          await createSubscriber({
            iccid: backendIccid,
            provider: providerData,
            name: defaultName,
            uuid: uuid,
          });
        }

        auth?.signIn(
          {
            simName: nameFromInput,
            idSim: nameFromInput.length === 6 ? backendImsi : backendIccid,
            code,
            provider: providerData,
          },
          subscriberRes.providers,
          balance
        );
        console.log("✅ SIM guardada:", {
          simName: nameFromInput,
          idSim: nameFromInput.length === 6 ? backendImsi : backendIccid,
          code,
          provider: providerData,
        });
        
        await AsyncStorage.setItem("currentICCID", inputIsIccid ? backendIccid : backendImsi);
        await AsyncStorage.setItem("@simType", inputIsIccid ? "iccid" : "imsi");

        return { data: { provider: providerData }, error: null };

      } catch (err) {
        console.error("🔥 Error general en loginRequest:", err);
        return { error: "Ocurrió un error inesperado en el login." };
      }
    },
    []
  );

  return { loginRequest };
}

