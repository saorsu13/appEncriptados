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
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import useModalAll from "@/hooks/useModalAll";

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

import { updateSimName } from "@/features/sims/simSlice";

// ─── Tipos ──────────────────────────────────────────────────────
import { BalanceRequest } from "@/features/balance/types";
import { BalanceResponse } from "@/api/simbalance";

const baseMsg = "pages.home";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const { simId } = useLocalSearchParams();
  const deviceUUID = useDeviceUUID();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme<ThemeCustom>();
  const queryClient = useQueryClient();
  const { showModal } = useModalAll();

  const currentSim = useAppSelector((s) => s.sims.currentSim);
  const countryCode = useAppSelector((s) => s.country.countryCode);
  const globalCurrency = useAppSelector((s) => s.currency.currency);
  const hasShownModal = useAppSelector((s) => s.version.hasShownModal);

  const [countryValue, setCountryValue] = useState(countryCode || "ca-CAD");
  const [refreshing, setRefreshing] = useState(false);
  const [versionFetched, setVersionFetched] = useState("");

  const body: BalanceRequest = {
    id: currentSim?.idSim as unknown as number,
    currencyCode: countryValue.split("-")[1],
    country: countryValue.split("-")[0].toUpperCase(),
  };

  const handleCountry = (value: string) => {
    console.log("🌎 Nuevo countryValue:", value);
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
      console.log("✅ Éxito balance:", res.data);
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
      console.log("🔍 currentSim en queryFn:", currentSim);
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
        try {
          const data = await listSubscriber(deviceUUID);
          console.log("📥 SIMs actualizadas desde API:", data);
          // Aquí podrías usar dispatch(updateSimList(data)) si lo deseas
        } catch (error) {
          console.error("❌ Error al obtener SIMs actualizadas:", error);
        }
      };
      fetchUpdatedSimList();
    }, [deviceUUID])
  );

  useEffect(() => {
    if (version && !hasShownModal && !areVersionsEqual) {
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

  const simType = determineType(currentSim.id);
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
