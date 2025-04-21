import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSubscriberData, listSubscriber } from "@/api/subscriberApi";
import { useDispatch } from "react-redux";
import { setSims } from "@/features/sims/simSlice";
import { useAuth } from "@/context/auth";

export function useRestoreSession(deviceUUID: string | null) {
  const [restoring, setRestoring] = useState(true);
  const [restoredProvider, setRestoredProvider] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!deviceUUID) return;

    const restore = async () => {
      const auth = useAuth();
      const iccid = await AsyncStorage.getItem("currentICCID");

      try {
        const listResponse = await listSubscriber(deviceUUID);

        if (!Array.isArray(listResponse) || listResponse.length === 0) {
          console.warn("⚠️ Lista de SIMs vacía. Borrando ICCID");
          await AsyncStorage.removeItem("currentICCID");
          auth.signOut();
          setRestoring(false);
          return;
        }

        const parsedSims = listResponse.map((sim) => ({
          idSim: sim.iccid,
          simName: sim.name,
          provider: sim.provider,
          iccid: sim.iccid,
          code: sim.code ?? "",
        }));

        dispatch(setSims(parsedSims));

        if (!iccid) {
          console.warn("🚫 No hay ICCID guardado. Saltando validación de existencia.");
          setRestoring(false);
          return;
        }

        const simExists = listResponse.some((sim) => String(sim.iccid) === String(iccid));
        if (!simExists) {
          console.warn("❌ SIM guardada no existe, limpiando sesión");
          await AsyncStorage.removeItem("currentICCID");
          auth.signOut();
          setRestoring(false);
          return;
        }

        const response = await getSubscriberData(iccid, deviceUUID);

        const provider = response?.providers?.[0]?.provider;
        if (provider) setRestoredProvider(provider);
      } catch (err) {
        console.error("🧨 Error restaurando sesión:", err);
        auth.signOut();
      } finally {
        setRestoring(false);
      }
    };

    restore();
  }, [deviceUUID]);

  return { restoring, restoredProvider };
}
