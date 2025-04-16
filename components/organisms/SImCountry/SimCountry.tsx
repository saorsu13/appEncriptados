import React, { useState, useEffect } from "react";
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-native-country-flag";
import { router } from "expo-router";

// Hooks y contexto
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { useModalAdminSims } from "@/context/modaladminsims";
import { useAppSelector, useAppDispatch } from "@/hooks/hooksStoreRedux";

// Redux actions
import { updateCurrentCountry } from "@/features/country/countrySlice";
import { setCurrency } from "@/features/currentCurrency/currencySlice";
import { setSimList } from "@/features/sims/simSlice";

// React Query
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrency } from "@/api/simbalance";
import { getDeviceUUID } from "../../../utils/getUUID";

// Componentes UI
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import CopyLabel from "@/components/molecules/CopyLabel/CopyLabel";
import SkeletonContent from "@/components/molecules/SkeletonContent";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";

// Tema
import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";

// Tipos
import type { Currency } from "@/api/simbalance";

interface SimCountryProps {
  sim: string;
  country: string;
  handleCountry: (value: string) => void;
}

const SimCountry: React.FC<SimCountryProps> = ({ sim, country, handleCountry }) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const globalCurrency = useAppSelector((s) => s.currency.currency);
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const { openModal } = useModalAdminSims();
  const queryClient = useQueryClient();
  const [uuid, setUUID] = useState<string | null>(null);

  const sims = useAppSelector((state) => state.sims.sims);

  useEffect(() => {
    getDeviceUUID().then((resolvedUUID) => {
      console.log("📱 UUID obtenido:", resolvedUUID);
      setUUID(resolvedUUID);
    });
  }, []);

  useEffect(() => {
    console.log("🧠 SIMs del Redux:", sims);
  }, [sims]);

  useEffect(() => {
    console.log("🧠 currentSim en SimCountry:", currentSim);
  }, [currentSim]);

  const selectedSim = sims.find((s) => s.idSim === currentSim?.idSim);
  const simText = selectedSim?.iccid || currentSim?.iccid || sim;

  // ✅ Redirección si el provider es telco-vision
  useEffect(() => {
    console.log("🔍 selectedSim:", selectedSim);
  
    const provider = selectedSim?.provider?.toLowerCase?.() || "";
    console.log("🧾 provider normalizado:", provider);
  
    if (provider === "telco-vision") {
      console.log("➡️ Redirigiendo a /balance");
      router.replace({
        pathname:"/balance",
        params: { simId: selectedSim.idSim }
    });
    }
  }, [selectedSim]);
  

  const {
    data: currencies = [],
    isFetching: fetchingCurrencies,
  } = useQuery<Currency[]>({
    queryKey: ["getCurrency"],
    queryFn: getCurrency,
    gcTime: 0,
    onSuccess: (data) => console.log("✅ getCurrency success:", data),
    onError: (err) => console.error("❌ getCurrency error:", err),
  });

  const convertCurrenciesToItems = (list: Currency[]) =>
    list.map((c, idx) => ({
      key: idx,
      value: c.value,
      label: c.value,
      icon: () => <CountryFlag isoCode={c.isoCode} size={15} />,
    }));

  const onCurrencyChange = (value: string) => {
    dispatch(setCurrency(value));
  };

  const onCountryChange = (value: string) => {
    handleCountry(value);
    dispatch(updateCurrentCountry(value));
  };

  return (
    <View style={styles.container}>
      <View style={styles.simContainer}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            const safeSims = sims.filter(
              (sim) => typeof sim.idSim === "string" && sim.iccid && typeof sim.iccid === "string"
            );
            console.log("📦 SIMs para el modal:", safeSims);
            openModal(safeSims);
          }}
        >
          <View style={styles.simButtonContent}>
            <Text
              allowFontScaling={false}
              style={[styles.textSim, themeMode === ThemeMode.Light && { color: theme.lightMode.colors.gray }]}
            >
              {t("pages.home.currentSim")}
            </Text>
            <IconSvg type="arrowupicon" height={25} width={25} />
          </View>
        </TouchableHighlight>
        <CopyLabel textValue={currentSim?.idSim || sim} />
      </View>

      <View style={styles.dropdownContainer}>
        {fetchingCurrencies ? (
          <SkeletonContent
            containerStyle={styles.skeleton}
            layout={[{ key: "currency", width: 115, height: 50, borderRadius: 5 }]}
            boneColor="rgba(255,255,255,0.25)"
          />
        ) : currencies.length > 0 ? (
          <Dropdown
            label={t("pages.home.currency")}
            items={convertCurrenciesToItems(currencies)}
            value={globalCurrency}
            handleValue={onCurrencyChange}
          />
        ) : (
          <Text>{t("pages.home.currencyNoData")}</Text>
        )}
      </View>
    </View>
  );
};

export default SimCountry;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 8,
    zIndex: 10,
  },
  simContainer: {
    width: "44%",
    flexDirection: "column",
    rowGap: 10,
  },
  simButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textSim: {
    flex: 1,
    ...theme.textVariants.descriptionCard,
    color: theme.colors.selectLabel,
  },
  dropdownContainer: {
    width: "50%",
  },
  skeleton: {
    width: 200,
    flexDirection: "row",
    marginTop: 34,
  },
});