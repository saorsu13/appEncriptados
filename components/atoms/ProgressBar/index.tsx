import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { StyleSheet, View } from "react-native";

type props = {
  precentage: number;
};

const ProgressBar = ({ precentage }: props) => {
  const { themeMode } = useDarkModeTheme();
  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.progressBar
          : {
              ...styles.progressBar,
              backgroundColor: theme.lightMode.colors.blueDark,
            },
        { width: `${precentage}%` },
      ]}
    ></View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    marginVertical: 8,
    height: 2,
    width: "100%",
    backgroundColor: theme.colors.contrast,
  },
  progressBarLight: {
    marginVertical: 8,
    height: 2,
    width: "100%",
    backgroundColor: theme.colors.contrast,
  },
});
