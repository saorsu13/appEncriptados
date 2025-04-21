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
  const [selectedSimIdVisual, setSelectedSimIdVisual] = useState<string | null>(null);

  const currentSim = useAppSelector((s) => s.sims.currentSim);
  const sims = useAppSelector((state) => state.sims.sims);
  const countryCode = useAppSelector((s) => s.country.countryCode);
  const globalCurrency = useAppSelector((s) => s.currency.currency);
  const hasShownModal = useAppSelector((s) => s.version.hasShownModal);

  const [countryValue, setCountryValue] = useState(countryCode || "ca-CAD");
  const [refreshing, setRefreshing] = useState(false);
  const [versionFetched, setVersionFetched] = useState("");

  const [userHasSelectedSim, setUserHasSelectedSim] = useState(false);

  const handleCountry = (value: string) => {
    setCountryValue(value);
  };

    // Extraemos la lógica de fetch para poder reutilizarla
    const fetchAndStoreSims = useCallback(async () => {
      try {
        const uuid = await getDeviceUUID();
        setDeviceUUID(uuid);
  
        const simsRaw = await listSubscriber(uuid);
        if (!Array.isArray(simsRaw)) {
          console.warn("🚨 listSubscriber no devolvió un array:", simsRaw);
          return;
        }
        const parsed = simsRaw.map(sim => ({
          idSim: String(sim.iccid),
          simName: sim.name,
          provider: sim.provider,
          iccid: String(sim.iccid),
          code: sim.id !== undefined
          ? Number(sim.id)  
          : 0, 
        }));
        dispatch(setSims(parsed));
  
        if (!currentSim && !userHasSelectedSim) {
               const nonT = parsed.find(s => s.provider !== "tottoli");
               const finalSim = nonT ?? parsed[0];
               await AsyncStorage.setItem("currentICCID", finalSim.iccid);
               dispatch(updateCurrentSim(finalSim.idSim));
               // el useEffect de abajo sincronizará selectedSimIdVisual
             }
      } catch (e) {
        console.error("❌ Error listSubscriber:", e);
      }
    }, [dispatch, currentSim]);

    const onUserSelectSim = useCallback((newIdSim: string) => {
      dispatch(updateCurrentSim(newIdSim));
      AsyncStorage.setItem("currentICCID", newIdSim);
    }, [dispatch]);

     // 1) Efecto “init” que corre sólo una vez, o si nos piden refetch
     useEffect(() => {
      fetchAndStoreSims();
    }, []);
     

    // 2) Tras volver de “new‑sim”, limpiar el flag para no refetchear eternamente
    useFocusEffect(
      useCallback(() => {
        if (refetchSims === "true") {
          router.replace({ pathname: "/home" });
        }
      }, [refetchSims])
    );

    // 3) Mantenemos tu effect de simId URL → currentSim como antes…
    useEffect(() => {
      if (!simId) return;
      const simIdStr = simId.toString();
      const stored = sims.find(s => s.idSim === simIdStr);
      if (stored && stored.idSim !== currentSim?.idSim) {
          dispatch(updateCurrentSim(stored.idSim));
        AsyncStorage.setItem("currentICCID", simIdStr);
        setSelectedSimIdVisual(simIdStr);
      }
    }, [simId, sims, currentSim, dispatch]);


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
        console.log("✅ [onSuccess] Balance API:", res.data);
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
  
  // ─── 4. Mostrar modal de versión si procede ───────────────────────────────
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
  }, [version, hasShownModal, areVersionsEqual, refetchSims]);

    
  // ─── 5. Disparar mutación de balance cuando currentSim o countryValue cambian ───────
  useEffect(() => {
    if (!currentSim) return;
    const body: BalanceRequest = {
      id: Number(currentSim.idSim),
      country: countryValue.split("-")[0].toUpperCase(),
      currencyCode: countryValue.split("-")[1],
    };

    console.log("🚀 Mutating balance con:", body);
    mutation.mutate(body);
  }, [currentSim, countryValue]);

  useEffect(() => {
    if (currentSim?.idSim) {
      setSelectedSimIdVisual(currentSim.idSim);
    }
  }, [currentSim]);

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
      const body: BalanceRequest = {
          id: Number(currentSim.idSim),
          currencyCode: countryValue.split("-")[1],
          country: countryValue.split("-")[0].toUpperCase(),
        };
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
        <HeaderEncrypted owner="encriptados" settingsLink="/settings-sign" />

        <View style={styles.container}>
          <SimCountry
            sim={selectedSimIdVisual}
            country={countryValue}
            handleCountry={handleCountry}
            onSelectSim={onUserSelectSim}
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

