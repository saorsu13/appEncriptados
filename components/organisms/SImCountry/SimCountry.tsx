import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import React, { useCallback, useEffect } from "react";
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import CopyLabel from "@/components/molecules/CopyLabel/CopyLabel";
import theme from "@/config/theme";

import { useDispatch } from "react-redux";
import { updateCurrentCountry } from "@/features/country/countrySlice";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

import { useQuery } from "@tanstack/react-query";
import { getCurrency, getCurrentBalanceByCurrency } from "@/api/simbalance";
import SkeletonContent from "@/components/molecules/SkeletonContent";
import Button from "@/components/atoms/Button/Button";
import { useModalAdminSims } from "@/context/modaladminsims";
import { useAppSelector, useAppDispatch } from "@/hooks/hooksStoreRedux";
import { setCurrency } from "@/features/currentCurrency/currencySlice";
import { useFocusEffect } from "expo-router";
import CountryFlag from "react-native-country-flag";

const SimCountry = ({ sim = "", country, handleCountry }) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const globalCurrency = useAppSelector((state) => state.currency.currency);

  const { data, isFetching } = useQuery({
    queryKey: ["getCurrency"],
    gcTime: 0,
    queryFn: () => getCurrency(),
  });

  const convertRatesToArray = (rates) => {
    return rates?.map((rate, index) => {
      return {
        key: index,
        value: rate?.value,
        label: rate?.value,
        icon: () => <CountryFlag isoCode={rate.isoCode} size={15} />,
      };
    });
  };

  const currentSim = useAppSelector((state) => {
    return state.sims.currentSim.idSim;
  });

  const sims = useAppSelector((state: any) => state.sims.sims);

  const state = useAppSelector((state) => {
    return state.sims.currentSim.idSim;
  });

  const {
    data: balance,
    isFetching: fetchingbalance,
    refetch,
  } = useQuery({
    queryKey: ["getCurrentBalanceByCurrency", globalCurrency],
    gcTime: 0,
    queryFn: () => getCurrentBalanceByCurrency(currentSim, globalCurrency),
  });

  const { openModal } = useModalAdminSims();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [state])
  );

  const handleCurrencyChange = (value) => {
    dispatch(setCurrency(value));
  };

  const baseMsg = "pages.home";

  const handleCountryValue = (value: string | number) => {
    handleCountry(value);
    dispatch(updateCurrentCountry(value));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerCopy}>
          <TouchableHighlight underlayColor={""} onPress={() => openModal()}>
            <View style={styles.simButtonContent}>
              <Text
                allowFontScaling={false}
                style={[
                  themeMode === ThemeMode.Dark
                    ? styles.textSim
                    : { ...styles.textSim, color: theme.lightMode.colors.gray },
                ]}
              >
                {t(`pages.home.currentSim`)}
              </Text>
              <IconSvg type="arrowupicon" height={25} width={25} />
            </View>
          </TouchableHighlight>
          <CopyLabel textValue={sim} />
        </View>

        <View style={{ width: "50%" }}>
          {data ? (
            <Dropdown
              label={t("pages.home.currency")}
              items={convertRatesToArray(data)}
              value={globalCurrency}
              handleValue={handleCurrencyChange}
            />
          ) : (
            <SkeletonContent
              containerStyle={{
                width: 200,
                flexDirection: "row",
                marginTop: 34,
              }}
              layout={[
                { key: "balance", width: 115, height: 50, borderRadius: 5 },
              ]}
              boneColor={"rgba(255,255,255,.25)"}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default SimCountry;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 5,
    zIndex: 10,
  },
  containerCopy: {
    display: "flex",
    gap: 10,
    width: "44%",
  },
  simButtonContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  textSim: {
    flex: 1,
    ...theme.textVariants.descriptionCard,
    color: theme.colors.selectLabel,
  },
});
