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

// Hooks y contexto
import { useAuth } from "@/context/auth";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { useModalPassword } from "@/context/modalpasswordprovider";
import useModalAll from "@/hooks/useModalAll";

// Componentes UI
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import BalanceDetails from "@/components/organisms/BalanceDetails/BalanceDetails";
import NetworkProfile from "@/components/organisms/NetworkProfile/NetworkProfile";
import SimOptions from "@/components/organisms/SimOptions/SimOptions";
import SimCountry from "@/components/organisms/SImCountry/SimCountry";
import SignIn from "@/components/organisms/SignIn/SignIn";
import Alert from "@/components/molecules/Alert";
import Label from "@/components/atoms/Label/Label";
import Skeleton2x2 from "@/components/molecules/SkeletonContent/Skeleton2x2";

// Utilidades y temas
import theme from "@/config/theme";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { determineType } from "@/utils/utils";
import { STORE_URLS } from "@/config/links/allLinks";

// API y servicios
import { getSimBalance } from "@/features/balance/useBalance";
import { getCurrentBalanceByCurrency } from "@/api/simbalance";
import { getVersion } from "@/api/version";
import { createSubscriber } from "@/api/subscriberApi";

// Redux slices
import { setHasShownModal } from "@/features/version/versionSlice";
import { updateCurrentCountry } from "@/features/country/countrySlice";
import { updateVoice } from "@/features/voice/voiceSlice";
import { updateCallback } from "@/features/callback/callbackSlice";
import { setLoading } from "@/features/loading/loadingSlice";
import {
  updateCurrentNetwork,
  updateRecommendedNetwork,
} from "@/features/network-profile/networkProfileSlice";

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

  const currentSim = useAppSelector((state) => state.sims.currentSim);
  const countryCode = useAppSelector((state) => state.country.countryCode);
  const globalCurrency = useAppSelector((state) => state.currency.currency);
  const hasShownModal = useAppSelector((state) => state.version.hasShownModal);

  const [countryValue, setCountryValue] = useState(
    countryCode || "ca-CAD"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [versionFetched, setVersionFetched] = useState("");

  const body: BalanceRequest = {
    id: currentSim?.idSim as unknown as number,
    currencyCode: countryValue.split("-")[1],
    country: countryValue.split("-")[0].toUpperCase(),
  };

  // -------- Handlers y funciones principales -------- //

  const handleCountry = (value: string) => {
    setCountryValue(value);
  };

  const openPlayStoreAppStore = async () => {
    const storeUrls = STORE_URLS[Constants.expoConfig.owner] || {};
    const platform = Platform.OS;
    const url = storeUrls[platform];

    if (url && (await Linking.canOpenURL(url))) {
      await Linking.openURL(url);
    }
  };

  // -------- Mutaciones y Queries -------- //

  const mutation = useMutation({
    gcTime: 0,
    mutationFn: (body: BalanceRequest) => getSimBalance(body),
    onSuccess: (response) => {
      dispatch(setLoading(false));
      if (response?.data?.voice) dispatch(updateVoice(response.data.voice));
      if (response?.data?.callback)
        dispatch(updateCallback(response.data.callback === "1"));
      if (response?.data?.profile)
        dispatch(updateCurrentNetwork(response.data.profile));
      if (response?.data?.recommended_profile)
        dispatch(updateRecommendedNetwork(response.data.recommended_profile));
    },
    onError: (error) => console.error("❌ Error balance:", error),
  });

  const onRefresh = useCallback(() => {
    dispatch(updateCurrentCountry(countryCode));
    mutation.mutate(body);
    refetchCurrency();
    dispatch(setLoading(true));
}, [dispatch, mutation.data, countryCode]);

  const { refetch: refetchCurrency } = useQuery<BalanceResponse>({
    gcTime: 0,
    queryKey: ["getCurrentBalanceByCurrency", currentSim, globalCurrency],
    queryFn: () => getCurrentBalanceByCurrency(currentSim?.id, globalCurrency),
    enabled: !!currentSim,
  });

  const { data: version, isFetching } = useQuery({
    queryKey: ["getVersion"],
    gcTime: 0,
    queryFn: () => getVersion("fantasma"),
  });

  const areVersionsEqual = useMemo(() => {
    return Constants.expoConfig.version === versionFetched;
  }, [versionFetched]);

  // -------- useEffect y ciclos -------- //

  useEffect(() => {
    if (versionFetched && !hasShownModal && !areVersionsEqual) {
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

  useEffect(() => {
    if (deviceUUID) console.log("📱 UUID del dispositivo:", deviceUUID);
    if (simId && typeof simId === "string" && simId.length === 6) {
      console.log("🧠 SIM de 6 dígitos detectada:", simId);
    }
  }, [deviceUUID, simId]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "android") {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
        return () => backHandler.remove();
      }
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      mutation.mutate(body);
    }, [currentSim?.id, countryCode, currentSim?.simName, currentSim?.code])
  );

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["getVersion"] });
      if (version) setVersionFetched(version[0]?.version);
    }, [isFetching, version])
  );

  // -------- Render principal -------- //

  if (!isLoggedIn || !currentSim) {
    return (
      <ScrollView style={{ backgroundColor: colors.background }}>
        <SignIn />
      </ScrollView>
    );
  }

  const simType = determineType(currentSim?.id);
  const data = mutation?.data;

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
      <HeaderEncrypted owner="app-fantasma" settingsLink="home/settings/sim" />

      <View style={styles.container}>
        <SimCountry
          sim={currentSim?.id}
          country={countryValue}
          handleCountry={handleCountry}
        />

        {data ? <BalanceDetails data={data} /> : null}
        <NetworkProfile />

        <Alert
          message={t(`${baseMsg}.profileWarning.title`)}
          description={t(`${baseMsg}.profileWarning.description`)}
          type="warning"
          showIcon
        />

        <Label
          fixWidth
          label={t("pages.home.simOptions.title")}
          variant="semiBold"
        />

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
