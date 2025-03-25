import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native";
import IconSvg from "../IconSvg/IconSvg";
import { useRouter } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeCustom } from "@/config/theme2";
import { ThemeMode } from "@/context/theme";
import Constants from "expo-constants";

const HeaderEncriptados = ({
  iconBack = "",
  settingsLink = "",
  title,
}: {
  iconBack?: string;
  title?: string;
  settingsLink?: string;
}) => {
  const router = useRouter();
  const { themeMode, toggleThemeMode } = useDarkModeTheme();
  const { colors } = useTheme<ThemeCustom>();

  const owner = Constants.expoConfig.owner;

  return (
    <View style={styles.containerHeader}>
      <View>
        {iconBack && iconBack !== "none" ? (
          <TouchableOpacity
            style={{
              ...styles.iconButton,
              backgroundColor: colors.backgroundAlternate,
            }}
            onPress={() => router.push(iconBack)}
          >
            <IconSvg
              height={20}
              width={20}
              color={colors.white}
              type="arrowback"
            />
          </TouchableOpacity>
        ) : iconBack === "" ? (
          <TouchableOpacity
            style={[
              {
                ...styles.iconButton,
                backgroundColor: colors.backgroundAlternate,
              },
            ]}
            onPress={() => router.push(settingsLink)}
          >
            <IconSvg
              color={colors.white}
              type="settings"
              height={25}
              width={25}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.titleContainer}>
        {title ? (
          <Text
            allowFontScaling={false}
            style={{ color: colors.primaryText, fontSize: 17 }}
          >
            {title}
          </Text>
        ) : owner === "encriptados" ? (
          <IconSvg color={colors.primaryText} type="encriptados" />
        ) : owner === "app-fantasma" ? (
          <Image
            style={{
              width: 250,
              height: 38,
            }}
            source={
              themeMode === ThemeMode.Dark
                ? require("@/assets/images/logoEncriptadosW.png")
                : require("@/assets/images/logoEncriptadosW.png")
            }
          />
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => {
          toggleThemeMode();
        }}
        style={[
          {
            ...styles.iconButton,
            backgroundColor: colors.backgroundAlternate,
          },
        ]}
      >
        <IconSvg color={colors.white} type="contrast" width={25} height={25} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderEncriptados;

const styles = StyleSheet.create({
  containerHeader: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    alignItems: "center",
    aspectRatio: 1,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "blue",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
