import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  BackHandler,
  Linking,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import Constants from "expo-constants";

// ─── Hooks y Contexto ─────────────────────────────────────────────
import { useAuth } from "@/context/auth";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import useModalAll from "@/hooks/useModalAll";
import { getDeviceUUID } from "@/utils/getUUID";
import { setSims } from "@/features/sims/simSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Componentes UI ──────────────────────────────────────────────
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import BalanceDetails from "@/components/organisms/BalanceDetails/BalanceDetails";
import NetworkProfile from "@/components/organisms/NetworkProfile/NetworkProfile";
import SimOptions from "@/components/organisms/SimOptions/SimOptions";
import SimCountry from "@/components/organisms/SImCountry/SimCountry";
import SignIn from "@/components/organisms/SignIn/SignIn";
import Alert from "@/components/molecules/Alert";
import Label from "@/components/atoms/Label/Label";
import Skeleton2x2 from "@/components/molecules/SkeletonContent/Skeleton2x2";
import { updateCurrentSim } from "@/features/sims/simSlice";

// ─── Utilidades y Temas ─────────────────────────────────────────
import theme from "@/config/theme";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { determineType } from "@/utils/utils";
import { STORE_URLS } from "@/config/links/allLinks";

// ─── API y Servicios ────────────────────────────────────────────
import { getSimBalance } from "@/features/balance/useBalance";
import { getCurrentBalanceByCurrency } from "@/api/simbalance";
import { getVersion } from "@/api/version";
import { listSubscriber } from "@/api/subscriberApi";

// ─── Redux Slices ───────────────────────────────────────────────
import { setHasShownModal } from "@/features/version/versionSlice";
import { updateCurrentCountry } from "@/features/country/countrySlice";
import { updateVoice } from "@/features/voice/voiceSlice";
import { updateCallback } from "@/features/callback/callbackSlice";
import { setLoading } from "@/features/loading/loadingSlice";
import {
  updateCurrentNetwork,
  updateRecommendedNetwork,
} from "@/features/network-profile/networkProfileSlice";


// ─── Tipos ──────────────────────────────────────────────────────
import { BalanceRequest } from "@/features/balance/types";
import { BalanceResponse } from "@/api/simbalance";

const baseMsg = "pages.home";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const { simId, refetchSims } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme<ThemeCustom>();
  const queryClient = useQueryClient();
  const { showModal } = useModalAll();
  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);

  const currentSim = useAppSelector((s) => s.sims.currentSim);
  const countryCode = useAppSelector((s) => s.country.countryCode);
  const globalCurrency = useAppSelector((s) => s.currency.currency);
  const hasShownModal = useAppSelector((s) => s.version.hasShownModal);

  const [countryValue, setCountryValue] = useState(countryCode || "ca-CAD");
  const [refreshing, setRefreshing] = useState(false);
  const [versionFetched, setVersionFetched] = useState("");

  // const body: BalanceRequest = {
  //   id: currentSim?.idSim as unknown as number,
  //   currencyCode: countryValue.split("-")[1],
  //   country: countryValue.split("-")[0].toUpperCase(),
  // };

  const handleCountry = (value: string) => {
    setCountryValue(value);
  };

  const openPlayStoreAppStore = async () => {
    const storeUrls = STORE_URLS[Constants.expoConfig.owner] || {};
    const url = storeUrls[Platform.OS];
    if (url && (await Linking.canOpenURL(url))) {
      await Linking.openURL(url);
    }
  };

  const mutation = useMutation({
    mutationFn: getSimBalance,
    onSuccess: (res) => {
      dispatch(setLoading(false));
      res.data.voice && dispatch(updateVoice(res.data.voice));
      res.data.callback && dispatch(updateCallback(res.data.callback === "1"));
      res.data.profile && dispatch(updateCurrentNetwork(res.data.profile));
      res.data.recommended_profile &&
        dispatch(updateRecommendedNetwork(res.data.recommended_profile));
    },
    onError: (err) => console.error("❌ Error balance:", err),
  });

  const { refetch: refetchCurrency } = useQuery<BalanceResponse>({
    queryKey: ["getCurrentBalanceByCurrency", currentSim?.idSim?.toString(), globalCurrency],
    queryFn: () => {
      return getCurrentBalanceByCurrency(currentSim?.idSim, globalCurrency);
    },
    enabled: !!currentSim,
    onSuccess: (data) => console.log("💱 Balance moneda:", data),
    onError: (err) => console.error("💱 Error moneda:", err),
  });

  const { data: version, isFetching } = useQuery({
    queryKey: ["getVersion"],
    queryFn: () => getVersion("fantasma"),
  });

  const areVersionsEqual = useMemo(
    () => Constants.expoConfig.version === versionFetched,
    [versionFetched]
  );

  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedSimList = async () => {
        if (!deviceUUID) return;
  
        const sims = await listSubscriber(deviceUUID);
        const parsedSims = sims.map((sim) => ({
          idSim: String(sim.iccid),
          simName: sim.name,
          provider: sim.provider,
          iccid: String(sim.iccid),
        }));
  
        dispatch(setSims(parsedSims));
  
        const storedICCID = await AsyncStorage.getItem("currentICCID");
  
        let finalSimId = parsedSims[0]?.iccid; 
  
        if (simId) {
          console.log("🔁 Sobrescribiendo simId desde URL:", simId);
          finalSimId = simId.toString();
          await AsyncStorage.setItem("currentICCID", finalSimId); 
        } else if (storedICCID) {
          finalSimId = storedICCID;
        }
  
        console.log("✅ SIM final seleccionada:", finalSimId);
  
        const selectedSim = parsedSims.find((sim) => sim.iccid === finalSimId);
  
        if (selectedSim) {
          console.log("🧩 [fetchUpdatedSimList] SIMs parseadas:", parsedSims);
          console.log("📍 [fetchUpdatedSimList] simId de la URL:", simId);
          console.log("💾 [fetchUpdatedSimList] simId en AsyncStorage:", storedICCID);
          console.log("🎯 [fetchUpdatedSimList] finalSimId:", finalSimId);
          console.log("✅ [fetchUpdatedSimList] selectedSim:", selectedSim);
  
          dispatch(updateCurrentSim(selectedSim));
        } else {
          console.warn("⚠️ SIM no encontrada en la lista. No se actualizó currentSim.");
        }
      };
  
      fetchUpdatedSimList();
    }, [deviceUUID, simId])
  );
  
  
  useEffect(() => {
    console.log("🆕 simId detectado por useLocalSearchParams:", simId);
  }, [simId]);
  

  useEffect(() => {
    if (
      version &&
      !hasShownModal &&
      !areVersionsEqual &&
      refetchSims !== "true"
    ) {
      showModal({
        type: "confirm",
        title: t("pages.home-tab.versiontitle"),
        description: t("pages.home-tab.versiondescription") + "?",
        buttonColorConfirm: colors.primaryColor,
        textConfirm: t("pages.home.confirm"),
        textCancel: t("pages.home.cancel"),
        buttonColorCancel: colors.danger,
        onConfirm: openPlayStoreAppStore,
      });
      dispatch(setHasShownModal(true));
    }
  }, [areVersionsEqual, versionFetched, hasShownModal]);

  // Logs de UUID y simId
  useEffect(() => {
  const fetchUUID = async () => {
    const uuid = await getDeviceUUID();
    setDeviceUUID(uuid);
  };

  fetchUUID();
}, []);

  // Mutación inicial al montar o cambiar SIM/país
  useEffect(() => {
    if (currentSim) {
      console.log("🧠 [useEffect] currentSim.idSim en /home:", currentSim.idSim);
      console.log("🧠 [useEffect] currentSim.iccid en /home:", currentSim.iccid);
      console.log("🧠 [useEffect] currentSim.provider en /home:", currentSim.provider);
      console.log("🧲 Mutando balance para SIM:", currentSim);
  
      const body: BalanceRequest = {
        id: currentSim?.idSim as unknown as number,
        currencyCode: countryValue.split("-")[1],
        country: countryValue.split("-")[0].toUpperCase(),
      };

      console.log("📦 [useEffect] Payload de balance:", body);

      mutation.mutate(body);
    }
  }, [currentSim?.idSim, countryCode]);
  

  // Invalidate version y capturar fetched
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["getVersion"] });
      version && setVersionFetched(version[0]?.version);
    }, [isFetching, version])
  );

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "android") {
        const sub = BackHandler.addEventListener(
          "hardwareBackPress",
          () => true
        );
        return () => sub.remove();
      }
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(updateCurrentCountry(countryCode));
    Promise.all([mutation.mutateAsync(body), refetchCurrency()]).finally(() =>
      setRefreshing(false)
    );
  }, [countryCode, mutation, refetchCurrency]);

  if (!isLoggedIn || !currentSim) {
    return <SignIn />;
  }

  const simType = determineType(currentSim.idSim);

  const data = mutation.data;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={colors.backgroundAlternate}
          colors={[colors.white]}
        />
      }
    >
      <HeaderEncrypted owner="encriptados" settingsLink="home/settings/sim" />

      <View style={styles.container}>
        <SimCountry
          sim={currentSim.idSim}
          country={countryValue}
          handleCountry={handleCountry}
        />

        {data && <BalanceDetails data={data} />}

        <NetworkProfile />

        <Alert
          message={t(`${baseMsg}.profileWarning.title`)}
          description={t(`${baseMsg}.profileWarning.description`)}
          type="warning"
          showIcon
        />

        <Label fixWidth label={t("pages.home.simOptions.title")} variant="semiBold" />

        {mutation.isPending ? (
          <Skeleton2x2
            layout={
              simType === "physical"
                ? new Array(4).fill({
                    width: "48%",
                    height: 140,
                    marginVertical: 5,
                    borderRadius: 20,
                  })
                : new Array(2).fill({
                    width: "48%",
                    height: 135,
                    marginVertical: 5,
                    borderRadius: 20,
                  })
            }
            containerStyle={{ width: "100%" }}
          />
        ) : (
          <SimOptions />
        )}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
