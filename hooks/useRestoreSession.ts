import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { getSubscriberData, listSubscriber } from "@/api/subscriberApi";
import { useDispatch } from "react-redux";
import { setSims } from "@/features/sims/simSlice";

export function useRestoreSession() {
  const uuid = useDeviceUUID();
  const [restoring, setRestoring] = useState(true);
  const [restoredProvider, setRestoredProvider] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const restore = async () => {
      const iccid = await AsyncStorage.getItem("currentICCID");


      if (!uuid) {
        console.warn("🚫 UUID no disponible. Cancelando restauración.");
        setRestoring(false);
        return;
      }

      try {
        const listResponse = await listSubscriber(uuid);

        if (!Array.isArray(listResponse) || listResponse.length === 0) {
          console.warn("⚠️ Lista de SIMs vacía. Borrando ICCID");
          await AsyncStorage.removeItem("currentICCID");
          setRestoring(false);
          return;
        }

        const parsedSims = listResponse.map((sim) => ({
          idSim: sim.iccid,
          simName: sim.name,
          provider: sim.provider,
          iccid: sim.iccid,
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
          setRestoring(false);
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
