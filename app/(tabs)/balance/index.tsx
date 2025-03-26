import { View, ScrollView, BackHandler, Platform } from "react-native";
import { useEffect, useMemo } from "react";
import { useRouter, Stack } from "expo-router"; 
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";

import { useAuth } from "@/context/auth";

import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import CurrentBalance from "@/components/molecules/CurrentBalance/CurrentBalance";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";
import HeaderEncriptados from "@/components/molecules/HeaderEncriptados/HeaderEncriptados";

const BalanceScreen = () => {
  const router = useRouter(); 
  const { colors } = useTheme<ThemeCustom>();
  const { providers } = useAuth();
  const currentPlan = useMemo(() => {
    const validProvider = providers?.find((p) => p?.plans?.length > 0);
    return validProvider?.plans?.[0];
  }, [providers]);
   

  useEffect(() => {
    console.log("💡 currentPlan en BalanceScreen:", currentPlan);
  }, [currentPlan]);
  
  useEffect(() => {
    const handleBack = () => {
      router.back();
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
          headerShown: true, 
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: "white",
          gestureEnabled: true,
        }}
      />

      <View style={{ ...balanceStyles.container, backgroundColor: colors.background }}>
        {/* 🔹 Header con botón de configuración */}
        <HeaderEncriptados settingsLink="balance/settings" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          {/* 🔹 Selector de SIM y Divisa */}
          <SimCurrencySelector />

          {/* 🔹 Línea separadora gris */}
          <View style={balanceStyles.separator} />

          {/* 🔹 Saldo actual */}
          <CurrentBalance
            usedData={currentPlan?.useddatabyte}
            totalData={currentPlan?.pckdatabyte}
            format={currentPlan?.format}
          />

          {/* 🔹 Tarjeta de datos móviles */}
          <DataBalanceCard
            totalData={currentPlan?.pckdatabyte}
            format={currentPlan?.format}
            region={currentPlan?.name}
          />

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