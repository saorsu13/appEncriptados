import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { InteractionManager } from "react-native";
import { getHasRedirectedFromTottoli, setHasRedirectedFromTottoli } from "@/utils/redirectionControl";

export default function Index() {
  const router = useRouter();
  const { isLoading, isLoggedIn, user } = useAuth();
  const hasRedirectedRef = useRef(false);
  
  useEffect(() => {
    console.log("🔄 [Index] useEffect → isLoading:", isLoading, "| hasRedirectedRef:", hasRedirectedRef.current);
    if (isLoading || hasRedirectedRef.current) return;
  
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
  }, [isLoading, isLoggedIn, user?.idSim, user?.provider]);
  
  

  if (isLoading || !hasRedirectedRef.current) {
    console.log("⏳ [Index] Mostrando pantalla de carga...");
    return (
      <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Cargando...</Text>
      </View>
    );
  }


  return null;
}

