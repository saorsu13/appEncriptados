import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, InteractionManager } from "react-native";
import { useAuth } from "@/context/auth";
import { useRestoreSession } from "@/hooks/useRestoreSession";
import { getHasRedirectedFromTottoli, setHasRedirectedFromTottoli } from "@/utils/redirectionControl";
import { getDeviceUUID } from "@/utils/getUUID";

export default function Index() {
  const router = useRouter();
  const { isLoading, isLoggedIn, user } = useAuth();

  const [uuid, setUuid] = useState<string | null>(null)

  const { restoring } = useRestoreSession(uuid)

  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    getDeviceUUID().then((id) => {
      setUuid(id);
    });
  }, []);

  useEffect(() => {
    console.log("🔄 [Index] useEffect → isLoading:", isLoading, 
      "restoring:", restoring,
      "hasRedirected:", hasRedirectedRef.current
    );
    if (isLoading || restoring || hasRedirectedRef.current) return;
  
    InteractionManager.runAfterInteractions(async () => {
      console.log("🔍 [Index] Autenticado:", isLoggedIn, "SIM:", user?.idSim, "Provider:", user?.provider);
  
      if (!isLoggedIn || !user?.idSim) {
        console.log("🚪 [Index] Redirigiendo a /home (no autenticado o sin SIM)");
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }
  
      if (user?.provider === "tottoli") {
        console.log("🧭 [Index] Detectado provider 'tottoli'");
        const alreadyRedirected = await getHasRedirectedFromTottoli();
        console.log("🔁 [Index] ¿Ya se redirigió desde tottoli?:", alreadyRedirected);

        if (!alreadyRedirected) {
          console.warn("🚫 [Index] Redirigiendo por primera vez desde SIM 'tottoli'");
          await setHasRedirectedFromTottoli(true);
        } else {
          console.log("✅ [Index] Ya se redirigió antes desde 'tottoli'");
        }
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }
      
  
      console.log("📦 [Index] Redirigiendo a /balance con SIM:", user.idSim);
      router.replace({
        pathname: "/(tabs)/balance",
        params: { simId: user.idSim },
      });
  
      hasRedirectedRef.current = true;
    });
  }, [isLoading, restoring, isLoggedIn, user?.idSim, user?.provider]);
  
  

  if (isLoading || restoring || !hasRedirectedRef.current) {
    console.log("⏳ [Index] Mostrando pantalla de carga...");
    return (
      <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Cargando...</Text>
      </View>
    );
  }


  return null;
}

