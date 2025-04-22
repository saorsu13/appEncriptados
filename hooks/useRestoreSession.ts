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
    if (!deviceUUID) {
      console.warn("🔌 [useRestoreSession] No hay deviceUUID, cancelando restauración");
      return;
    } 

    const restore = async () => {
      console.log("🧩 [useRestoreSession] Iniciando restauración con UUID:", deviceUUID);
      const auth = useAuth();

      const iccid = await AsyncStorage.getItem("currentICCID");
      console.log("📦 [useRestoreSession] ICCID guardado:", iccid);

      try {
        const listResponse = await listSubscriber(deviceUUID);
        console.log("📡 [useRestoreSession] SIMs obtenidas del backend:", listResponse);

        if (!Array.isArray(listResponse) || listResponse.length === 0) {
          console.warn("⚠️ [useRestoreSession] Lista de SIMs vacía. Borrando ICCID y cerrando sesión.");
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
        console.log("🧾 [useRestoreSession] SIMs parseadas:", parsedSims);
        dispatch(setSims(parsedSims));

        if (!iccid) {
          console.warn("🚫 [useRestoreSession] No hay ICCID en almacenamiento. No se valida existencia.");
          setRestoring(false);
          return;
        }

        const simExists = listResponse.some((sim) => String(sim.iccid) === String(iccid));
        console.log("🔎 [useRestoreSession] ¿SIM guardada existe?", simExists);


        if (!simExists) {
          console.warn("❌ [useRestoreSession] La SIM guardada no existe en la lista. Cerrando sesión.");
          await AsyncStorage.removeItem("currentICCID");
          auth.signOut();
          setRestoring(false);
          return;
        }

        const response = await getSubscriberData(iccid, deviceUUID);
        console.log("📬 [useRestoreSession] Detalle de SIM restaurada:", response);

        const provider = response?.providers?.[0]?.provider;
        if (provider){
          console.log("🏷️ [useRestoreSession] Provider restaurado:", provider);
           setRestoredProvider(provider);
        }
      } catch (err) {
        console.error("🧨 [useRestoreSession] Error restaurando sesión:", err);
        auth.signOut();
      } finally {
        setRestoring(false);
        console.log("✅ [useRestoreSession] Restauración finalizada");
      }
    };

    restore();
  }, [deviceUUID]);

  return { restoring, restoredProvider };
}
