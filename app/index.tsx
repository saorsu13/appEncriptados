import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { InteractionManager } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isLoading, isLoggedIn, user } = useAuth();
  const hasRedirectedRef = useRef(false); // 🔒

  useEffect(() => {
    if (isLoading || hasRedirectedRef.current) return;

    InteractionManager.runAfterInteractions(() => {
      if (!isLoggedIn || !user?.idSim) {
        console.log("🔁 No hay sesión o SIM activa, redirigiendo a /home (login)");
        router.replace("/(tabs)/home");
        hasRedirectedRef.current = true;
        return;
      }

      const provider = user?.provider || "telco-vision";

      if (provider === "telco-vision") {
        console.log("✅ Provider: telco-vision → redirigiendo a /balance");
        router.replace("/(tabs)/balance");
      } else if (provider === "tottoli") {
        console.log("✅ Provider: tottoli → redirigiendo a /home");
        router.replace("/(tabs)/home");
      } else {
        console.warn("❓ Provider desconocido → redirigiendo a /home");
        router.replace("/(tabs)/home");
      }

      hasRedirectedRef.current = true;
    });
  }, [isLoading, isLoggedIn, user]);

  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Cargando...</Text>
    </View>
  );
}
