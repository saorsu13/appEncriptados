import React, { useEffect, useMemo } from "react";
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { balanceStyles } from "./balanceStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import TopUpCard from "@/components/molecules/TopUpCard/TopUpCard";
import { useAuth } from "@/context/auth";
import SignIn from "@/components/organisms/SignIn/SignIn";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useRouter } from "expo-router";
import SimCurrencySelector from "@/components/molecules/SimCurrencySelector/SimCurrencySelector";
import { updateCurrentSim, resetSimState } from "@/features/sims/simSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";


const BalanceScreen = () => {
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const { isLoggedIn } = useAuth();

  const dispatch = useDispatch();

  const router = useRouter();
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const BackgroundWrapper = isDarkMode ? View : require("expo-linear-gradient").LinearGradient;
  const backgroundProps = isDarkMode
    ? { style: [{ ...balanceStyles.container }, { backgroundColor: colors.background }] }
    : {
        colors: ["#E6F9FF", "#FFFFFF"],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        style: balanceStyles.container,
      };

      const allSims = useAppSelector((state) => state.sims.sims);
      const mappedSims = useMemo(() => {
        return allSims
          .filter(sim => sim && sim.iccid && sim.simName)
          .map(sim => ({
            id: sim.iccid,
            name: sim.simName,
            logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"),
            number: sim.iccid,
            provider: sim.provider,
          }));
      }, [allSims]);

      useEffect(() => {
        if (!currentSim || currentSim.provider === "tottoli") {
          console.warn("🚫 [Balance] SIM inválida o tipo 'tottoli', redirigiendo...");
          router.replace("/home");
        }
      }, [currentSim]);
      

      if (!isLoggedIn) {
        console.log("🔐 [BalanceScreen] Usuario no autenticado, mostrando SignIn");
        return <SignIn />;
      }


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

        <HeaderEncrypted
          owner="encriptados"
          settingsLink="balance/settings/sim?from=balance"
        />

        <ScrollView contentContainerStyle={balanceStyles.content}>
        <SimCurrencySelector
          sims={mappedSims}
          selectedId={currentSim?.iccid}
          onSelectSim={async (id) => {
            const sim = allSims.find((s) => s.iccid === id);
            if (!sim) return;

            if (sim.provider === "tottoli") {
              await AsyncStorage.removeItem("currentICCID");
              dispatch(resetSimState());
              router.replace("/home");
              return;
            }

            await AsyncStorage.setItem("currentICCID", sim.iccid);
            dispatch(updateCurrentSim(sim.iccid));
          }}
        />
        <View style={balanceStyles.separator} />
        
          <TopUpCard />
        </ScrollView>
      </BackgroundWrapper>
    </>
  );
};

export default BalanceScreen;
