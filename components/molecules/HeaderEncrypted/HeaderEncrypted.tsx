import { TouchableOpacity, View, StyleSheet, Text, Image, Dimensions } from "react-native";
import IconSvg from "../IconSvg/IconSvg";
import { useRouter } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeCustom } from "@/config/theme2";
import { ThemeMode } from "@/context/theme";
import Constants from "expo-constants";

const { width: screenWidth } = Dimensions.get("window");

const HeaderEncrypted = ({
  iconBack = "",
  settingsLink = "",
  title,
  owner,
}: {
  iconBack?: string;
  title?: string;
  settingsLink?: string;
  owner?: "app-fantasma" | "encriptados";
}) => {
  const router = useRouter();
  const { themeMode, toggleThemeMode } = useDarkModeTheme();
  const { colors } = useTheme<ThemeCustom>();

  const resolvedOwner = owner ?? Constants.expoConfig.owner;

  const getLogo = () => {
    if (resolvedOwner === "app-fantasma") {
      return (
        <Image
          source={
            themeMode === ThemeMode.Dark
              ? require("@/assets/images/logo-l.png")
              : require("@/assets/images/logo-d.png")
          }
          style={{ width: 230, height: 35, resizeMode: "contain" }}
        />
      );
    }

    if (resolvedOwner === "encriptados") {
      // Adaptamos el tamaño según el ancho de pantalla
      const dynamicWidth = screenWidth < 350 ? 160 : screenWidth < 400 ? 180 : 200;
      const dynamicHeight = dynamicWidth * (30 / 180); // Relación proporcional 180x30

      return (
        <Image
          source={
            themeMode === ThemeMode.Dark
              ? require("@/assets/images/encriptados_logo_b.png")
              : require("@/assets/images/encriptados_logo.png")
          }
          style={{ width: dynamicWidth, height: dynamicHeight, resizeMode: "contain" }}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.containerHeader}>
      <View>
        {iconBack && iconBack !== "none" ? (
          <TouchableOpacity
            style={{
              ...styles.iconButton,
              backgroundColor: colors.backgroundAlternate,
            }}
            onPress={() => router.back()}
          >
            <IconSvg height={20} width={20} color={colors.white} type="arrowback" />
          </TouchableOpacity>
        ) : iconBack === "" ? (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.backgroundAlternate }]}
            onPress={() => router.push(settingsLink)}
          >
            <IconSvg color={colors.white} type="settings" height={25} width={25} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        {title ? (
          <Text allowFontScaling={false} style={{ color: colors.primaryText, fontSize: 17 }}>
            {title}
          </Text>
        ) : (
          getLogo()
        )}
      </View>

      <TouchableOpacity
        onPress={toggleThemeMode}
        style={[styles.iconButton, { backgroundColor: colors.backgroundAlternate }]}
      >
        <IconSvg color={colors.white} type="contrast" width={25} height={25} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderEncrypted;

const styles = StyleSheet.create({
  containerHeader: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
