import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldRedirect(true);
    }, 100); 

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      console.log("Redirigiendo a /home");
      router.replace("/(tabs)/home");
    }
  }, [shouldRedirect]);

  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Cargando...</Text>
    </View>
  );
}
