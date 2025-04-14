// hooks/useRestoreSession.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { getSubscriberData } from "@/api/subscriberApi";
import { listSubscriber } from "@/api/subscriberApi";

export function useRestoreSession() {
  const router = useRouter();
  const uuid = useDeviceUUID();
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const iccid = await AsyncStorage.getItem("currentICCID");

      if (!iccid || !uuid) {
        console.log("🔁 No hay sesión guardada o UUID aún no disponible");
        setRestoring(false);
        return;
      }

      try {
        const listResponse = await listSubscriber(uuid);

        if (!Array.isArray(listResponse) || listResponse.length === 0) {
          console.warn("📭 No hay SIMs asociadas al UUID. Borrando sesión.");
          await AsyncStorage.removeItem("currentICCID");
          router.replace("/home");
          return;
        }

        const response = await getSubscriberData(iccid, uuid);
        const provider = response?.providers?.[0]?.provider;

        if (!provider) {
          console.warn("❌ Provider no encontrado al restaurar sesión.");
          return;
        }

        console.log("✅ Restaurando sesión con provider:", provider);

        if (provider === "telco-vision") {
          router.replace("/balance");
        } else if (provider === "tottoli") {
          router.replace("/home");
        }
      } catch (err) {
        console.error("🧨 Error restaurando sesión:", err);
      } finally {
        setRestoring(false);
      }
    };

    restore();
  }, [uuid]);

  return restoring;
}
