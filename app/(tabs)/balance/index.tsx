import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, BackHandler, Platform } from "react-native";
import { useRouter, Stack, useFocusEffect } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import {
  listSubscriber,
  deleteSubscriber,
  getSubscriberData,
} from "@/api/subscriberApi";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import DataBalanceCard from "@/components/molecules/DataBalanceCard/DataBalanceCard";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import DeleteSimButton from "@/components/molecules/DeleteSimButton/DeleteSimButton";
import { LinearGradient } from "expo-linear-gradient";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";

const BalanceScreen = () => {
  const router = useRouter();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const [sims, setSims] = useState([]);
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [simPlans, setSimPlans] = useState([]);
  const currentSimId = sims.length > 0 ? sims[0].iccid : null;
  const deviceUUID = useDeviceUUID();

  // Solo se ejecuta cuando deviceUUID esté disponible
  const fetchSubscriberData = async (id: string) => {
    if (!deviceUUID) {
      console.warn("UUID no disponible, se cancela la petición.");
      return;
    }
    try {
      setSelectedSimId(id);
      const response = await getSubscriberData(id, deviceUUID);
      if (!response || !response.providers || response.providers.length === 0) {
        console.warn("Respuesta vacía, la SIM puede no estar procesada aún.");
        setSimPlans([]);
        return;
      }
      const firstProvider = response.providers[0];
      setSimPlans(firstProvider?.plans || []);
      console.log("✅ Plan actualizado para SIM:", id);
    } catch (error) {
      console.error("❌ Error al obtener los planes de la SIM:", error);
      setSimPlans([]);
    }
  };

  // La función se dispara cuando deviceUUID tiene valor
  const fetchSubscribers = async () => {
    if (!deviceUUID) {
      console.warn("UUID no disponible, no se puede listar las SIMs.");
      return;
    }
    try {
      const data = await listSubscriber(deviceUUID);
      console.log("Este es el deviceUUID", deviceUUID);
      setSims(data || []);
      if (data && data.length > 0) {
        const defaultId = data[0].iccid;
        fetchSubscriberData(defaultId);
      }
    } catch (error) {
      console.error("Error listando las SIMs:", error);
    }
  };

  // Se ejecuta apenas deviceUUID esté definido
  useEffect(() => {
    if (deviceUUID) {
      fetchSubscribers();
    }
  }, [deviceUUID]);

  useFocusEffect(
    useCallback(() => {
      if (deviceUUID) {
        fetchSubscribers();
      }
      if (Platform.OS === "android") {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
        return () => backHandler.remove();
      }
    }, [deviceUUID])
  );

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
          headerShown: false,
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
            sims={sims
              .filter((sim) => sim != null)
              .map((sim) => ({
                id: sim.iccid,
                name: sim.name,
                logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
                number: sim.iccid,
              }))}
            onSelectSim={(id) => fetchSubscriberData(id)}
          />

          <View style={balanceStyles.separator} />

          {simPlans.map((plan, index) => {
            const totalMB = Number(plan.pckdatabyte) || 0;
            const usedMB = Number(plan.useddatabyte) || 0;
            const remainingMB = Math.max(totalMB - usedMB, 0);
            const remainingGB = (remainingMB / 1024).toFixed(2);

            return (
              <DataBalanceCard
                key={index}
                totalData={remainingGB}
                format="GB"
                region={plan.name || "Sin región"}
              />
            );
          })}

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
