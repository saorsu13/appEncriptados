import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { InteractionManager } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isLoading, isLoggedIn, user } = useAuth();
  const hasRedirectedRef = useRef(false);
  
  useEffect(() => {
    if (isLoading || hasRedirectedRef.current) return;
  
    InteractionManager.runAfterInteractions(() => {
      if (!isLoggedIn || !user?.idSim) {
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }
  
      if (!user?.provider) {
        return;
      }
  
      const provider = user.provider;
  
      if (provider === "telco-vision") {
        router.replace("/(tabs)/balance");
      } else if (provider === "tottoli") {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(tabs)/home");
      }
  
      hasRedirectedRef.current = true;
    });
  }, [isLoading, isLoggedIn, user?.idSim, user?.provider]);
  
  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Cargando...</Text>
    </View>
  );
}
