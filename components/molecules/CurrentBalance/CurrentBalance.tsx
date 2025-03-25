import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { BalanceResponse } from "@/api/simbalance";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { formatNumber } from "@/utils/utils";
import { currentBalanceStyles } from "./currentBalanceStyles";
import { getCurrentBalance } from "@/api/simbalance";

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

  return (
    <View style={currentBalanceStyles.container}>
      <View style={currentBalanceStyles.balanceHeader}>
        <Text style={currentBalanceStyles.balanceLabel}>Saldo actual</Text>
        <View style={currentBalanceStyles.balanceAmount}>
          <Text allowFontScaling={false} style={currentBalanceStyles.balanceValue}>
            {isFetching
              ? "..."
              : getbalance
              ? `${formatNumber(getbalance?.balance?.toFixed(2))} ${getbalance?.currency_code}`
              : "~"}
          </Text>
        </View>
      </View>

      {usedData && totalData && (
        <Text style={{ color: "white", marginTop: 5 }}>
          {usedData}/{totalData} {format.toUpperCase()} usados
        </Text>
      )}

      <TouchableOpacity>
        <IconSvg
          color={currentBalanceStyles.infoIcon.color}
          height={25}
          width={25}
          type="info"
        />
      </TouchableOpacity>
    </View>
  );
};


export default CurrentBalance;