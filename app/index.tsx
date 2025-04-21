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
    if (isLoading || hasRedirectedRef.current) return;
  
    InteractionManager.runAfterInteractions(async () => {
      console.log("🔍 Autenticado:", isLoggedIn, "SIM:", user?.idSim, "Provider:", user?.provider);
  
      if (!isLoggedIn || !user?.idSim) {
        console.log("🚪 Redirigiendo a /home (no autenticado o sin SIM)");
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }
  
      if (user?.provider === "tottoli") {
        const alreadyRedirected = await getHasRedirectedFromTottoli();
      
        if (!alreadyRedirected) {
          console.warn("🚫 Redirigiendo por primera vez desde SIM 'tottoli'");
          await setHasRedirectedFromTottoli(true);
        } else {
          console.log("✅ Ya se redirigió antes desde 'tottoli'");
        }
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }
      
  
      console.log("📦 Redirigiendo a /balance con SIM:", user.idSim);
      router.replace({
        pathname: "/(tabs)/balance",
        params: { simId: user.idSim },
      });
  
      hasRedirectedRef.current = true;
    });
  }, [isLoading, isLoggedIn, user?.idSim, user?.provider]);
  
  

  if (isLoading || !hasRedirectedRef.current) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Cargando...</Text>
    </View>
  );
}
