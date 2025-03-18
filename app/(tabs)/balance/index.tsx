import { View, Text, Image, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Button } from "react-native";
import CurrentBalance from "@/components/molecules/CurrentBalance/CurrentBalance"; // ✅ Componente de saldo
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted"; // ✅ Menú y ajustes
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { balanceStyles } from "./balanceStyles"; // ✅ Importación de estilos
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";
import { useEffect } from "react";

const BalanceScreen = () => {
  const router = useRouter();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();

  useEffect(() => {
    console.log("BalanceScreen loaded, ensuring header is hidden.");
  }, []);

  return (
    <>
      {/* 🔹 Ocultar header explícitamente */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ ...balanceStyles.container, backgroundColor: colors.background }}>
        {/* 🔹 Header con botón de configuración (Si quieres quitarlo, comenta esta línea) */}
        <HeaderEncrypted settingsLink="balance/settings" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          {/* 🔹 Saldo actual */}
          <CurrentBalance />

          {/* 🔹 Tarjeta de datos móviles */}
          <DataBalanceCard />

          {/* 🔹 Tarjeta de recarga */}
          <TopUpCard />

          <DeleteSimButton onPress={() => console.log("SIM borrada")} />

          {/* 🔹 Botón para regresar a Home */}
          <View style={balanceStyles.buttonContainer}>
            <Button title="Volver a Inicio" onPress={() => router.push("/home")} />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default BalanceScreen;