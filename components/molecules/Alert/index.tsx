import { StyleSheet, Text, View } from "react-native";
import theme from "@/config/theme";

import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type props = {
  message: string;
  type: string;
  description: string;
  showIcon?: boolean;
};

const Alert = ({
  message = null,
  type,
  description,
  showIcon = false,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const getTextColor = () => {
    switch (type) {
      case "warning":
        return theme.colors.warningText;
        break;
      default:
        return "#fff";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <IconSvg
            color={
              themeMode === ThemeMode.Dark
                ? theme.colors.warningIcon
                : theme.colors.warningIcon
            }
            height={25}
            width={25}
            type="verificationwarning"
          />
        );
        break;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.container
          : {
              ...styles.container,
              backgroundColor: theme.lightMode.colors.yellowLight,
            },
      ]}
    >
      {showIcon && <View style={styles.iconContainer}>{getIcon()}</View>}
      <View style={styles.content}>
        {message && (
          <Text
            allowFontScaling={false}
            style={{ ...styles.title, color: getTextColor() }}
          >
            {message}
          </Text>
        )}
        <View>
          <Text
            allowFontScaling={false}
            style={{ ...styles.description, color: getTextColor() }}
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#301E03",
    padding: 20,
    borderRadius: 20,
    position: "relative",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  iconContainer: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  title: {
    ...theme.textVariants.titleBold,
    marginBottom: 5,
    marginLeft: 0,
    width: "100%",
  },
  description: {
    ...theme.textVariants.descriptionCard,
    maxWidth: "100%",
  },
});
