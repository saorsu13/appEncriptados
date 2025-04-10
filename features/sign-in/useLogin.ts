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
  const uuid = useDeviceUUID();
  const uuidRef = useRef(uuid);

  useEffect(() => {
    uuidRef.current = uuid;
  }, [uuid]);

  const loginRequest = useCallback(
    async (id, code, nameFromInput) => {
      if (!uuidRef.current) {
        console.warn("⛔ UUID aún no disponible.");
        return { error: "UUID aún no está listo. Intenta de nuevo." };
      }
  
      try {
        const loginRes = await login({ id, code });
  
        if (loginRes.status === "fail") {
          return { error: "Login fallido o sin datos válidos" };
        }
  
        let subscriberRes;
        try {
          subscriberRes = await getSubscriberData(id.toString(), uuidRef.current);
        } catch (err) {
          return { error: "Error al obtener datos de la SIM" };
        }
  
        const providerData = subscriberRes?.providers?.[0]?.provider;
        const iccid = subscriberRes?.providers?.[0]?.iccid;
        const balance = subscriberRes?.providers?.[0]?.balance;
        const validProviders = subscriberRes?.providers?.filter(Boolean) || [];
  
        if (!providerData || !iccid) {
          return { error: "SIM inválida o sin información suficiente." };
        }
  
        // Nombre por defecto según longitud
        const defaultName =
          id.toString().length === 19
            ? "Sim Tim"
            : id.toString().length === 6
            ? "Sim Encr"
            : nameFromInput;
  
        let sims = [];
        try {
          const simListRes = await listSubscriber(uuidRef.current);
          if (Array.isArray(simListRes)) sims = simListRes;
        } catch (err) {
          console.warn("ℹ️ No se pudo listar las SIMs asociadas.");
        }
  
        const simExists = sims.some((sim) => sim.iccid === iccid);
        const simLimitReached = sims.length >= 5;
  
        if (!simExists && !simLimitReached) {
          try {
            const createRes = await createSubscriber({
              iccid,
              provider: providerData,
              name: defaultName,
              uuid: uuidRef.current,
            });
  
            console.log("📝 Respuesta de creación:", createRes);
          } catch (err) {
            console.error("❌ Error al crear la SIM desde el frontend:", err);
            return { error: "No se pudo crear la SIM desde el frontend." };
          }
        } else if (simExists) {
          console.log("✅ SIM ya está registrada con este UUID.");
        } else {
          console.warn("🚫 Ya se alcanzó el límite de 5 SIMs por UUID.");
        }
  
        auth?.signIn(
          {
            simName: nameFromInput,
            idSim: id,
            code,
          },
          validProviders,
          balance
        );
  
        // Devolver el provider explícitamente para manejar la redirección en la vista
        await AsyncStorage.setItem("currentICCID", iccid);
        
        return {
          data: {
            provider: providerData,
          },
          error: null,
        };
      } catch (err) {
        console.error("🔥 Error general en loginRequest:", err);
        return { error: "Ocurrió un error inesperado en el login." };
      }
    },
    [uuid, auth]
  );
  

  return { loginRequest };
}
