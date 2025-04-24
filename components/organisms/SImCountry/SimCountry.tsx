import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-native-country-flag";
import { router, usePathname } from "expo-router";

// Hooks y contexto
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { useModalAdminSims } from "@/context/modaladminsims";
import { useAppSelector, useAppDispatch } from "@/hooks/hooksStoreRedux";

// Redux actions
import { updateCurrentCountry } from "@/features/country/countrySlice";
import { setCurrency } from "@/features/currentCurrency/currencySlice";

// React Query
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrency } from "@/api/simbalance";
import { getDeviceUUID } from "../../../utils/getUUID";

// Componentes UI
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import SkeletonContent from "@/components/molecules/SkeletonContent";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";

// Tema
import { ThemeCustom } from "@/config/theme2"
import { ThemeMode } from "@/context/theme";
import { useTheme } from "@shopify/restyle";

// Tipos
import type { Currency } from "@/api/simbalance";

interface SimCountryProps {
  sim: string;
  country: string;
  handleCountry: (value: string) => void;
  onSelectSim: (idSim: string) => void;
}

const SimCountry: React.FC<SimCountryProps> = ({ sim, country, handleCountry, onSelectSim }) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const globalCurrency = useAppSelector((s) => s.currency.currency);
  const currentSim = useAppSelector((state) => state.sims.currentSim);
  const { openModal } = useModalAdminSims();
  const queryClient = useQueryClient();
  const [uuid, setUUID] = useState<string | null>(null);
  const sims = useAppSelector((state) => state.sims.sims);
  const pathname = usePathname();
  const { colors } = useTheme<ThemeCustom>();

  useEffect(() => {
    getDeviceUUID().then((resolvedUUID) => {
      setUUID(resolvedUUID);
    });
  }, []);

  useEffect(() => { }, [sims]);
  useEffect(() => { }, [currentSim]);

  const selectedSim = sims.find((s) => s.idSim === currentSim?.idSim);
  const simText = selectedSim?.iccid || currentSim?.iccid || sim;

  useEffect(() => {
    const provider = selectedSim?.provider?.toLowerCase?.() || "";
    if (provider === "telco-vision" && pathname !== "/balance") {
      router.replace({
        pathname: "/balance",
        params: { simId: selectedSim.idSim },
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

  const getSimIcon = (sim: any) => {
    if (sim?.provider?.toLowerCase?.() === "tottoli") {
      return require("@/assets/images/adaptive-icon.png");
    } else if (sim?.provider?.toLowerCase?.() === "telco-vision") {
      return require("@/assets/images/tim_icon_app_600px_negativo 1.png");
    }
    return null;
  };

  const dynamicDropdownButton = {
    backgroundColor:
      themeMode === ThemeMode.Dark ? colors.backgroundSecondary : colors.blueLight,
    borderColor:
      themeMode === ThemeMode.Dark ? colors.strokeBorder : colors.strokeBorder,
    borderWidth: 0.4,
    borderRadius: 8,
    paddingVertical: 12.7,
    paddingHorizontal: 12,
    marginTop: 5,
  };

  return (
    <View style={styles.container}>
      <View style={styles.simContainer}>
        <Text
          allowFontScaling={false}
          style={[styles.simLabel, themeMode === ThemeMode.Light && { color: colors.gray }]}
        >
          {t("pages.home.currentSim")}
        </Text>

        <TouchableOpacity
          style={dynamicDropdownButton}
          onPress={() => {
            const safeSims = sims
              .filter((sim) => typeof sim.idSim === "string" && sim.iccid && typeof sim.iccid === "string")
              .sort((a, b) => {
                const orderA = a.provider === "tottoli" ? 0 : 1;
                const orderB = b.provider === "tottoli" ? 0 : 1;
                return orderA - orderB;
              });

            openModal(safeSims, (pickedSim) => {
              onSelectSim(pickedSim.idSim);
            });
          }}
        >
          <View style={styles.dropdownContent}>
            <Text
              allowFontScaling={false}
              style={[
                styles.simName,
                { color: colors.primaryText } // ✅ Color dinámico según tema
              ]}
            >
              {currentSim?.simName || sim}
            </Text>
            <Image source={getSimIcon(selectedSim)} style={styles.simIcon} />
            <IconSvg type="arrowupicon" height={20} width={20} />
          </View>
        </TouchableOpacity>
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
    width: "48%",
    flexDirection: "column",
    rowGap: 10,
  },
  simLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  simName: {
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 5,
  },
  simIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 8,
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