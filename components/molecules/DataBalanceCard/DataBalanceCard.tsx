import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getStyles } from "./dataBalanceCardStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

type Props = {
  totalData?: string;
  format?: string;
  region?: string;
};

const DataBalanceCard = ({
  totalData = "0",
  format = "GB",
  region = "REGIÓN",
}: Props) => {
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const styles = getStyles(isDarkMode);
  const { t } = useTranslation();
  const baseMsg = "organism.balanceDetails";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(`${baseMsg}.mobileData`)}</Text>

      <View style={styles.content}>
        <View style={styles.leftSection}>
          <IconSvg type="wifi" height={30} width={30} color="#00AEEF" />
          <Text style={styles.dataText}>
            {totalData} {format.toUpperCase()}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.rightSection}>
          <Icon name="earth" size={24} color={styles.regionText.color} />
          <View style={styles.textWrapper}>
            <Text style={styles.regionText}>
              {region.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DataBalanceCard;