import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { BalanceResponse, getCurrentBalance } from "@/api/simbalance";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { formatNumber } from "@/utils/utils";
import { getStyles } from "./currentBalanceStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

type Props = {
  usedData?: string;
  totalData?: string;
  format?: string;
};

const CurrentBalance = ({ usedData = "0", totalData = "0", format = "mb" }: Props) => {
  const { data: getbalance, isFetching } = useQuery<BalanceResponse>({
    queryKey: ["getCurrentBalance"],
    queryFn: () => getCurrentBalance(),
  });

  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>Saldo actual</Text>
        <View style={styles.balanceAmount}>
          <Text allowFontScaling={false} style={styles.balanceValue}>
            {isFetching
              ? "..."
              : getbalance
              ? `${formatNumber(getbalance?.balance?.toFixed(2))} ${getbalance?.currency_code}`
              : "~"}
          </Text>
        </View>
      </View>

      {usedData && totalData && (
        <Text style={styles.usedDataText}>
          {usedData}/{totalData} {format.toUpperCase()} usados
        </Text>
      )}

      <TouchableOpacity>
        <IconSvg
          color={styles.infoIcon.color}
          height={25}
          width={25}
          type="info"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CurrentBalance;
