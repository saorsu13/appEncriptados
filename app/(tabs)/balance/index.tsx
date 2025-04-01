import React, { useEffect, useMemo } from "react";
import { View, ScrollView, BackHandler, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useAuth } from "@/context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

import { listSubscriber, deleteSubscriber } from "@/api/subscriberApi";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
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
  const [sims, setSims] = React.useState([]);

  const plans = useMemo(() => {
    const validProvider = providers?.find((p) => Array.isArray(p.plans) && p.plans.length > 0);
    return validProvider ? validProvider.plans : [];
  }, [providers]);

  const currentSimId = sims.length > 0 ? sims[0].iccid : null;

  const handleDeleteSim = async (idSim) => {
    try {
      await deleteSubscriber(idSim);
      console.log("SIM borrada exitosamente");
      setSims((prevSims) => prevSims.filter((sim) => sim.iccid !== idSim));
    } catch (error) {
      console.error("Error al borrar la SIM:", error);
    }
  };

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const data = await listSubscriber();
        setSims(data || []);
      } catch (error) {
        console.error("Error listando las SIMs:", error);
      }
    }

    fetchSubscribers();

    // ✅ Este bloque previene navegación hacia atrás
    const handleBack = () => {
      return true; // 👈 Bloquea el botón de retroceso
    };

    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack);
      return () => backHandler.remove(); // Limpia el listener
    }
  }, []);

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
        <HeaderEncrypted owner="encriptados" settingsLink="balance/settings" />

        <ScrollView contentContainerStyle={balanceStyles.content}>
          <SimCurrencySelector
            sims={
              sims
                .filter((sim) => sim != null)
                .map((sim) => ({
                  id: sim.iccid,
                  name: sim.name,
                  logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
                  number: sim.iccid,
                })) || []
            }
          />

          <View style={balanceStyles.separator} />

          {plans.map((plan, index) => (
            <DataBalanceCard
              key={index}
              totalData={plan.pckdatabyte}
              format="GB"
              region={plan.name}
            />
          ))}

          <TopUpCard />

          {currentSimId && (
            <DeleteSimButton onPress={() => handleDeleteSim(currentSimId)} />
          )}
        </ScrollView>
      </BackgroundWrapper>
    </>
  );
};

export default BalanceScreen;
