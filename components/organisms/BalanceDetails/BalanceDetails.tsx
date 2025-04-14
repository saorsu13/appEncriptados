import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  updateRecommendedNetwork,
  updateCurrentNetwork,
} from "@/features/network-profile/networkProfileSlice";

import { useAppSelector } from "@/hooks/hooksStoreRedux";
import ModalInfo from "@/components/molecules/ModalInfo";
import CardItem from "@/components/molecules/CardItem/CardItem";
import Label from "@/components/atoms/Label/Label";
import SkeletonContent from "@/components/molecules/SkeletonContent";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { setInsufficientFunds } from "@/features/balance/insufficientFundsSlice";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { updateCallback } from "@/features/callback/callbackSlice";
import { updateVoice } from "@/features/voice/voiceSlice";
import { updateSubstitute } from "@/features/substitute/substituteSlice";
import { determineType, formatNumber } from "@/utils/utils";
import theme from "@/config/theme";
import { BalanceRequest } from "@/features/balance/types";
import { BalanceResponse } from "@/api/simbalance";
import { useFocusEffect } from "expo-router";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { getCurrency, getCurrentBalanceByCurrency } from "@/api/simbalance";

import { WebView } from "react-native-webview";
import { setBalance } from "@/features/balance/balanceSlice";
//ESTE ANY DEBE ELIMINARSE LUEGO, ESTO ES POR EL MAL CODIGO QUE DEJARON =(

const BalanceDetails = ({ data }: any) => {
  const [prevBalance, setPrevBalance] = useState(0);

  const { themeMode } = useDarkModeTheme();
  const balance = useAppSelector((state) => state.insufficientFunds);

  const { t } = useTranslation();

  const globalCurrency = useAppSelector((state) => state.currency.currency);
  const sims = useAppSelector((state: any) => state.sims.sims);

  const currentSimId = currentSim?.idSim; // o .id si fuera un número

const { data: getbalance } = useQuery<BalanceResponse>({
  queryKey: ["getCurrentBalanceByCurrency", currentSimId, globalCurrency],
  queryFn: async () => {
    console.log("🔎 Llamando getCurrentBalanceByCurrency con:", currentSimId, globalCurrency);
    return await getCurrentBalanceByCurrency(currentSimId, globalCurrency);
  },
  enabled: !!currentSimId,
});

  const baseMsg = "pages.home";
  const currentSim = useSelector((state: any) => state.sims.currentSim);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const loading = useAppSelector((state) => state.loading.isLoading);
  const simType = determineType(currentSim?.idSim);

  const handleInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["95%", "95%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const { colors } = useTheme<ThemeCustom>();

  const [loadingWebView, setLoadingWebView] = useState(true);

  useEffect(() => {
    dispatch(setBalance(formatNumber(getbalance?.balance?.toFixed(2))));
  }, [getbalance]);

  return (
    <View style={styles.container}>
      {/* <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        backgroundStyle={{ backgroundColor: colors.backgroundAlternate }}
        handleIndicatorStyle={{ backgroundColor: colors.white }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <WebView
          style={{ backgroundColor: colors.backgroundAlternate }}
          source={{
            uri: "https://app.encriptados.io/api/payment/es/50043/dark",
          }}
        />
      </BottomSheetModal> */}

      <View style={styles.balanceContainer}>
        <View style={styles.balanceHeader}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "75%",
              gap: 10,
            }}
          >
            {isFetching ? (
              <SkeletonContent
                containerStyle={{ flex: 1, width: 200, flexDirection: "row" }}
                layout={[
                  { key: "balance", width: 115, height: 28, borderRadius: 5 },
                  {
                    key: "currency",
                    width: 160,
                    height: 28,
                    marginLeft: 10,
                    borderRadius: 5,
                  },
                ]}
                boneColor={"rgba(255,255,255,.25)"}
              />
            ) : (
              <>
                <Label label={t(`${baseMsg}.currentBalance`)} />
                <View style={styles.mainBalanceContainer}>
                  <IconSvg
                    color={
                      themeMode === ThemeMode.Dark
                        ? theme.colors.softSKin
                        : theme.lightMode.colors.blueDark
                    }
                    type="wallet"
                    height={25}
                    width={25}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      themeMode === ThemeMode.Dark
                        ? styles.balanceValue
                        : {
                            ...styles.balanceValue,
                            color: theme.lightMode.colors.blueDark,
                          },
                    ]}
                  >
                    {getbalance
                      ? `${formatNumber(getbalance?.balance?.toFixed(2))} ${
                          getbalance?.currency_code
                        }`
                      : "~"}
                  </Text>
                </View>
              </>
            )}
          </View>
          <TouchableOpacity onPress={handleInfoModal}>
            <IconSvg
              color={
                themeMode === ThemeMode.Dark
                  ? theme.lightMode.colors.graySoft
                  : theme.lightMode.colors.actualBalance
              }
              height={25}
              width={25}
              type="info"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContent}>
          <CardItem
            onClick={() => {
              handlePresentModalPress();
            }}
            icon={
              <IconSvg
                color={
                  themeMode === ThemeMode.Dark
                    ? theme.colors.greenLight
                    : theme.colors.mainActionState
                }
                height={40}
                width={40}
                type="wifi"
              />
            }
            title={
              data?.data?.gb_availables
                ? `${data?.data?.gb_availables} GB`
                : "~"
            }
            message={t("organism.balanceDetails.mobileData")}
            caption={
              getbalance && getbalance?.currency_code
                ? `${formatNumber(getbalance?.balance_internet?.toFixed(0))} ${
                    getbalance?.currency_code
                  }`
                : "~"
            }
            style={{
              width: simType === "physical" ? "33%" : "50%",
            }}
            loading={loading}
          />
          <CardItem
            onClick={() => {
              handlePresentModalPress();
            }}
            icon={
              <IconSvg
                color={
                  themeMode === ThemeMode.Dark
                    ? theme.colors.greenLight
                    : theme.colors.mainActionState
                }
                height={40}
                width={40}
                type="phone"
              />
            }
            title={
              data?.data?.minutes_availables
                ? data?.data?.minutes_availables
                : "~"
            }
            message={t("organism.balanceDetails.minutes")}
            caption={
              getbalance && getbalance?.currency_code
                ? `${formatNumber(getbalance?.balance_minutes?.toFixed(0))} ${
                    getbalance?.currency_code
                  }`
                : "~"
            }
            style={{
              width: simType === "physical" ? "33%" : "50%",
            }}
            loading={loading}
          />
          {simType === "physical" && (
            <CardItem
              onClick={() => {
                handlePresentModalPress();
              }}
              icon={
                <IconSvg
                  color={
                    themeMode === ThemeMode.Dark
                      ? theme.colors.greenLight
                      : theme.colors.mainActionState
                  }
                  height={40}
                  width={40}
                  type="safetyclock"
                />
              }
              title={
                data?.data?.imsi_changes_availables
                  ? data?.data?.imsi_changes_availables
                  : "~"
              }
              message={t("organism.balanceDetails.imsi")}
              caption={
                getbalance && getbalance?.currency_code
                  ? `${formatNumber(getbalance?.balance_imsi_changes)} ${
                      getbalance?.currency_code
                    }`
                  : "~"
              }
              style={{ width: "33%" }}
              loading={loading}
            />
          )}
        </View>
      </View>
      <ModalInfo
        visible={modalVisible}
        onClose={handleInfoModal}
        title={t("organism.balanceDetails.helpMessages.title")}
        description={t("organism.balanceDetails.helpMessages.message")}
        buttonText={t("organism.balanceDetails.helpMessages.closeBtnText")}
      />
    </View>
  );
};

export default BalanceDetails;

const styles = StyleSheet.create({
  containerbottom: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 20,
    width: "100%",
  },
  balanceContainer: {
    display: "flex",
    gap: 15,
    width: "100%",
  },
  balanceHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainBalanceContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginLeft: 5,
  },
  balanceValue: {
    alignItems: "center",
    color: theme.colors.softSKin,
    display: "flex",
    justifyContent: "center",
    ...theme.textVariants.inputCode,
  },
  balanceContent: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
});
