import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { getSubscriberData, listSubscriber } from "@/api/subscriberApi";

export function useRestoreSession() {
  const uuid = useDeviceUUID();
  const [restoring, setRestoring] = useState(true);
  const [restoredProvider, setRestoredProvider] = useState<string | null>(null);

  useEffect(() => {
    const restore = async () => {
      const iccid = await AsyncStorage.getItem("currentICCID");

      if (!iccid || !uuid) {
        setRestoring(false);
        return;
      }

      try {
        const listResponse = await listSubscriber(uuid);
        if (!Array.isArray(listResponse) || listResponse.length === 0) {
          await AsyncStorage.removeItem("currentICCID");
          return;
        }

        const response = await getSubscriberData(iccid, uuid);
        const provider = response?.providers?.[0]?.provider;
        if (provider) setRestoredProvider(provider);
      } catch (err) {
        console.error("🧨 Error restaurando sesión:", err);
      } finally {
        setRestoring(false);
      }
    };

    restore();
  }, [uuid]);

  return { restoring, restoredProvider };
}
