import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { BalanceResponse } from "@/api/simbalance";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { formatNumber } from "@/utils/utils";
import { currentBalanceStyles } from "./currentBalanceStyles";

const CurrentBalance = () => {
  const { data: getbalance, isFetching } = useQuery<BalanceResponse>({
    gcTime: 0,
    queryKey: ["getCurrentBalance"],
  });

  return (
    <View style={currentBalanceStyles.container}>
      <View style={currentBalanceStyles.balanceHeader}>
        <Text style={currentBalanceStyles.balanceLabel}>Saldo actual</Text>

        <View style={currentBalanceStyles.balanceAmount}>
          
          <Text
            allowFontScaling={false}
            style={currentBalanceStyles.balanceValue}
          >
            {isFetching
              ? "..."
              : getbalance
              ? `${formatNumber(getbalance?.balance?.toFixed(2))} ${getbalance?.currency_code}`
              : "~"}
          </Text>
        </View>
      </View>

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