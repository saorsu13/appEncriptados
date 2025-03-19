import { View, ScrollView, BackHandler, Platform } from "react-native";
import { useEffect } from "react";
import { useRouter, Stack } from "expo-router"; // ✅ Volvemos a usar useRouter()
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";

import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import CurrentBalance from "@/components/molecules/CurrentBalance/CurrentBalance";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";

const BalanceScreen = () => {
  const router = useRouter(); // ✅ Volvemos a usar useRouter() de expo-router
  const { colors } = useTheme<ThemeCustom>();

  useEffect(() => {
    const handleBack = () => {
      router.back(); // ✅ Vuelve a la pantalla anterior correctamente en expo-router
      return true;
    };

    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack);
      return () => backHandler.remove();
    }
  }, [router]);

  return (
    <>
      {/* ✅ Se mantiene el header en iOS para permitir gestos de swipe-back */}
      <Stack.Screen
        options={{
          headerShown: true, // ✅ Se debe mostrar el header para habilitar el gesto en iOS
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: "white",
          gestureEnabled: true, // ✅ Habilita el gesto de swipe-back en iOS
        }}
      />

      <View style={{ ...balanceStyles.container, backgroundColor: colors.background }}>
        {/* 🔹 Header con botón de configuración */}
        <HeaderEncrypted settingsLink="balance/settings" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          {/* 🔹 Selector de SIM y Divisa */}
          <SimCurrencySelector />

          {/* 🔹 Línea separadora gris */}
          <View style={balanceStyles.separator} />

          {/* 🔹 Saldo actual */}
          <CurrentBalance />

          {/* 🔹 Tarjeta de datos móviles */}
          <DataBalanceCard />

          {/* 🔹 Tarjeta de recarga */}
          <TopUpCard />

          {/* 🔹 Botón para borrar SIM con mayor espacio */}
          <DeleteSimButton onPress={() => console.log("SIM borrada")} />
        </ScrollView>
      </View>
    </>
  );
};

export default BalanceScreen;