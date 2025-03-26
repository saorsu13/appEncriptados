import React, { useEffect, useMemo } from "react";
import { View, ScrollView, BackHandler, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useAuth } from "@/context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

import HeaderEncriptados from "@/components/molecules/HeaderEncriptados/HeaderEncriptados";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import CurrentBalance from "@/components/molecules/CurrentBalance/CurrentBalance";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";

const BalanceScreen = () => {
  const router = useRouter();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const { providers } = useAuth();

  const currentPlan = useMemo(() => {
    const validProvider = providers?.find((p) => p?.plans?.length > 0);
    return validProvider?.plans?.[0];
  }, [providers]);

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

  const BackgroundWrapper = isDarkMode ? View : LinearGradient;
  const backgroundProps = isDarkMode
    ? { style: [balanceStyles.container, { backgroundColor: colors.background }] }
    : {
        colors: ["#E6F9FF", "#FFFFFF"],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        style: balanceStyles.container,
      };

  return (
    <>
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

      <BackgroundWrapper {...backgroundProps}>
        <HeaderEncriptados settingsLink="balance/settings" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          <SimCurrencySelector />

          <View style={balanceStyles.separator} />

          <CurrentBalance
            usedData={currentPlan?.useddatabyte}
            totalData={currentPlan?.pckdatabyte}
            format={currentPlan?.format}
          />

          <DataBalanceCard
            totalData={currentPlan?.pckdatabyte}
            format={currentPlan?.format}
            region={currentPlan?.name}
          />

          <TopUpCard />

          <DeleteSimButton onPress={() => console.log("SIM borrada")} />
        </ScrollView>
      </BackgroundWrapper>
    </>
  );
};

export default BalanceScreen;
