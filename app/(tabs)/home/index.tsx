import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import theme from "@/config/theme";
import BalanceDetails from "@/components/organisms/BalanceDetails/BalanceDetails";
import NetworkProfile from "@/components/organisms/NetworkProfile/NetworkProfile";
import SimOptions from "@/components/organisms/SimOptions/SimOptions";
import Alert from "@/components/molecules/Alert";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { updateCurrentCountry } from "@/features/country/countrySlice";
import { useAuth } from "@/context/auth";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import SignIn from "@/components/organisms/SignIn/SignIn";
import SimCountry from "@/components/organisms/SImCountry/SimCountry";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { BalanceResponse } from "@/api/simbalance";
import { getSimBalance } from "@/features/balance/useBalance";
import { BalanceRequest } from "@/features/balance/types";
import { useFocusEffect } from "expo-router";
import { updateVoice } from "@/features/voice/voiceSlice";
import { updateCallback } from "@/features/callback/callbackSlice";
import { setLoading } from "@/features/loading/loadingSlice";
import Skeleton2x2 from "@/components/molecules/SkeletonContent/Skeleton2x2";
import { ActivityIndicator } from "react-native-paper";
import Label from "@/components/atoms/Label/Label";
import { Linking } from "react-native";
import Constants from "expo-constants";
import { getCurrentBalanceByCurrency } from "@/api/simbalance";

import { determineType } from "@/utils/utils";
import {
  updateCurrentNetwork,
  updateRecommendedNetwork,
} from "@/features/network-profile/networkProfileSlice";
import { getVersion } from "@/api/version";
import { setHasShownModal, setVersion } from "@/features/version/versionSlice";
import * as Application from "expo-application";
import { isPending } from "@reduxjs/toolkit";
import useModalAll from "@/hooks/useModalAll";
import { STORE_URLS } from "@/config/links/allLinks";

const baseMsg = "pages.home";

const Home = () => {
  const { isLoggedIn, isLoading, signOut } = useAuth();

  const isActive = useAppSelector(
    (state) => state.activePasswordRequired.isActive
  );

  const { colors } = useTheme<ThemeCustom>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentSim = useAppSelector((state) => state.sims.currentSim);
  const countryCode = useAppSelector((state) => state.country.countryCode);

  const [countryValue, setCountryValue] = useState(
    countryCode !== "" ? countryCode : "ca-CAD"
  );
  const [prevCountryValue, setPrevCountryValue] = useState(`${countryValue}`);
  const [refreshing, setRefreshing] = useState(false);

  const { openModal, isModalVisible } = useModalPassword();

  const body = {
    id: currentSim?.idSim as unknown as number,
    currencyCode: countryValue?.toString().split("-")[1],
    country: countryValue?.toString().split("-")[0].toUpperCase(),
  };

  const mutation = useMutation({
    gcTime: 0,
    mutationFn: (body: BalanceRequest) => getSimBalance(body),
    onSuccess: (response) => {
      dispatch(setLoading(false));

      if (response?.data?.voice) {
        dispatch(updateVoice(response?.data?.voice));
      }

      if (response?.data?.profile) {
        dispatch(updateCurrentNetwork(response?.data?.profile));
      }

      if (response?.data?.callback) {
        dispatch(
          updateCallback(response?.data?.callback === "1" ? true : false)
        );
      }

      if (response?.data?.recommended_profile) {
        dispatch(updateRecommendedNetwork(response?.data?.recommended_profile));
      }

      if (response?.data?.profile) {
        dispatch(updateCurrentNetwork(response?.data?.profile));
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useFocusEffect(
    useCallback(() => {
      mutation.mutate(body);
    }, [
      currentSim,
      currentSim?.idSim,
      countryCode,
      currentSim?.simName,
      currentSim?.code,
    ])
  );

  const globalCurrency = useAppSelector((state) => state.currency.currency);

  const hasShownModal = useAppSelector((state) => {
    return state.version.hasShownModal;
  });

  const { refetch: refetchCurrency } = useQuery<BalanceResponse>({
    gcTime: 0,
    queryKey: ["getCurrentBalanceByCurrency", currentSim, globalCurrency],
    queryFn: async () => {
      if (!currentSim) return null;
      return await getCurrentBalanceByCurrency(currentSim, globalCurrency);
    },
    enabled: !!currentSim,
  });
  

  const handleCountry = (value) => {
    setPrevCountryValue(`${countryValue}`);
    setCountryValue(value);
  };

  const onRefresh = useCallback(() => {
    refetchCurrency();

    dispatch(updateCurrentCountry(countryCode));
    mutation.mutate(body);
    dispatch(setLoading(true));
  }, [dispatch, mutation.data, countryCode]);

  const { data: version, isFetching } = useQuery({
    queryKey: ["getVersion"],
    gcTime: 0,
    queryFn: () => getVersion("fantasma"),
  });

  const currentVersionLocal = Constants.expoConfig.version;

  const queryClient = useQueryClient();
  const [versionFetched, setVersionFetched] = useState("");
  const { showModal } = useModalAll();

  // Memoriza la comparación de versiones
  const areVersionsEqual = useMemo(() => {
    return currentVersionLocal === versionFetched;
  }, [currentVersionLocal, versionFetched]);

  const openPlayStoreAppStore = async () => {
    const storeUrls = {
      encriptados: {
        android: STORE_URLS.ENCRIPTADOS_ANDROID_URL,
        ios: STORE_URLS.ENCRIPTADOS_IOS_URL,
      },
      "app-fantasma": {
        android: STORE_URLS.FANTASMA_ANDROID_URL,
        ios: STORE_URLS.FANTASMA_IOS_URL,
      },
    };

    const owner = Constants.expoConfig.owner;
    const platform = Platform.OS;
    const url = storeUrls[owner]?.[platform];

    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    }
  };

  console.log(areVersionsEqual);

  console.log(versionFetched);

  useEffect(() => {
    if (versionFetched && !hasShownModal) {
      if (!areVersionsEqual) {
        showModal({
          type: "confirm",
          title: t("pages.home-tab.versiontitle"),
          description: t(`pages.home-tab.versiondescription`) + "?",
          buttonColorConfirm: colors.primaryColor,
          textConfirm: t(`pages.home.confirm`),
          textCancel: t(`pages.home.cancel`),
          buttonColorCancel: colors.danger,
          onConfirm: async () => {
            openPlayStoreAppStore();
          },
        });

        dispatch(setHasShownModal(true));
      }
    }
  }, [areVersionsEqual, versionFetched, hasShownModal]);

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries["getVersion"];
      if (version) {
        setVersionFetched(version[0]?.version);
      }
    }, [isFetching, versionFetched])
  );

  if (!isLoggedIn || !currentSim) {
    return (
      <ScrollView
        style={{
          backgroundColor: colors.background,
        }}
      >
        <SignIn />
      </ScrollView>
    );
  }

  const data = mutation?.data;

  const simType = determineType(currentSim?.idSim);
  

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={colors.backgroundAlternate}
          colors={[colors.white]}
        />
      }
    >
      <HeaderEncrypted settingsLink="home/settings/sim" />

      <View style={[styles.container]}>
        <SimCountry
          sim={currentSim?.idSim}
          country={countryValue}
          handleCountry={handleCountry}
        />

        <BalanceDetails data={data} />

        <NetworkProfile />

        <Alert
          message={t(`${baseMsg}.profileWarning.title`)}
          description={t(`${baseMsg}.profileWarning.description`)}
          type="warning"
          showIcon={true}
        />

        <Label
          fixWidth
          label={t(`pages.home.simOptions.title`)}
          variant="semiBold"
        />
        {mutation.isPending ? (
          <Skeleton2x2
            layout={
              simType == "physical"
                ? [
                    {
                      width: "48%",
                      height: 140,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                    {
                      width: "48%",
                      height: 140,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                    {
                      width: "48%",
                      height: 140,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                    {
                      width: "48%",
                      height: 140,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                  ]
                : [
                    {
                      width: "48%",
                      height: 135,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                    {
                      width: "48%",
                      height: 135,
                      marginVertical: 5,
                      borderRadius: 20,
                    },
                  ]
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
  containerHeader: {
    display: "flex",
    gap: 20,
  },
  containerHeaderBar: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: theme.colors.roundedGray,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
});
