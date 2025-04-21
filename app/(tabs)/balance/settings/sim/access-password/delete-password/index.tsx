import React, { useEffect } from "react";
import { View } from "react-native";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import PinInputScreen from "@/components/molecules/PinInputScreen/PinInputScreen";
import { useMenu } from "@/context/menuprovider";

import PinInputDeleteScreen from "@/components/molecules/PinInputScreen/PinInputDeleteScreen";

const DeleteAccessPassword = () => {
  const { colors } = useTheme<ThemeCustom>();

  const { isMenuVisible, setIsMenuVisible } = useMenu();

  return (
    <>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        {isMenuVisible ? (
          <HeaderEncrypted iconBack="balance/settings/sim/access-password" />
        ) : null}
        <PinInputDeleteScreen />
      </View>
    </>
  );
};

export default DeleteAccessPassword;
