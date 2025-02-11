import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Bancolombia from "./IconsPayments/Bancolombia";
import Visa from "./IconsPayments/Visa";
import MasterCard from "./IconsPayments/MasterCard";
import PSE from "./IconsPayments/PSE";
import AmericanExpress from "./IconsPayments/AmericanExpress";
import Unknown from "./IconsPayments/Unknown";
import BitCoin from "./IconsPayments/BitCoin";
import TLogo from "./IconsPayments/TLogo";
import Piramid from "./IconsPayments/Piramid";
import MoneyBlue from "./IconsPayments/MoneyBlue";
import DLogo from "./IconsPayments/DLogo";
import LLogo from "./IconsPayments/LLogo";
import DHL from "./IconsPayments/DHL";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import VisaDark from "./IconsPayments/VisaDark";
import { t } from "i18next";

interface IconData {
  component: JSX.Element;
  key: string;
}

const PaymentsHome: React.FC = () => {
  const { themeMode } = useDarkModeTheme();
  const iconData: IconData[] = [
    { component: <Bancolombia height={50} width={50} />, key: "bancolombia" },
    {
      component:
        themeMode === ThemeMode.Dark ? (
          <Visa height={50} width={50} />
        ) : (
          <VisaDark height={50} width={50} />
        ),
      key: "visa",
    },
    { component: <MasterCard height={50} width={50} />, key: "mastercard" },
    { component: <PSE height={50} width={50} />, key: "pse" },
    {
      component: <AmericanExpress height={50} width={50} />,
      key: "americanexpress",
    },
    { component: <Unknown height={50} width={50} />, key: "unknown" },
    { component: <BitCoin height={50} width={50} />, key: "bitcoin" },
    { component: <TLogo height={50} width={50} />, key: "tlogo" },
    { component: <Piramid height={50} width={50} />, key: "piramid" },
    { component: <MoneyBlue height={50} width={50} />, key: "moneyblue" },
    { component: <DLogo height={50} width={50} />, key: "dlogo" },
    { component: <LLogo height={50} width={50} />, key: "llogo" },
  ];
  const { colors } = useTheme<ThemeCustom>();
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text allowFontScaling={false} style={styles.title}>
        {t("pages.home-tab.paySecure")}
      </Text>
      <View style={styles.iconsContainer}>
        {chunkArray(iconData, 4).map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((item) => (
              <CenteredIcon key={item.key}>{item.component}</CenteredIcon>
            ))}
          </View>
        ))}
      </View>

      <Text allowFontScaling={false} style={{ ...styles.title, marginTop: 25 }}>
        {t("pages.home-tab.shipping")}
      </Text>
      <View style={{ marginBottom: 40 }}>
        <DHL />
      </View>
    </View>
  );
};

const CenteredIcon: React.FC<{ children: JSX.Element }> = ({ children }) => (
  <View style={styles.centeredIcon}>{children}</View>
);

const chunkArray = (array: any[], chunkSize: number) => {
  return Array(Math.ceil(array.length / chunkSize))
    .fill(undefined)
    .map((_, index) => index * chunkSize)
    .map((begin) => array.slice(begin, begin + chunkSize));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 30,
  },
  iconsContainer: {
    width: "100%",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  centeredIcon: {
    flex: 1,
    alignItems: "center",
  },
});

export default PaymentsHome;
