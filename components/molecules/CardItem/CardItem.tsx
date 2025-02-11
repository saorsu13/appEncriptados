import theme from "@/config/theme";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SkeletonContent from "../SkeletonContent";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type props = {
  icon?: ReactNode;
  title: string;
  message?: string;
  caption?: string;
  style?: Record<string, any>;
  loading?: boolean;
  onClick?: () => void;
};

const CardItem = ({
  icon,
  title,
  message,
  caption,
  style,
  loading = true,
  onClick,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View
        style={[
          themeMode === ThemeMode.Dark
            ? styles.containerBody
            : {
                ...styles.containerBody,
                backgroundColor: theme.lightMode.colors.blueLight,
                borderWidth: 2,
                borderColor: theme.lightMode.colors.borderBlueLight,
              },
        ]}
      >
        {icon && icon}
        {loading ? (
          <SkeletonContent
            containerStyle={{
              flex: 1,
              width: 50,
              height: 28,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
            layout={[
              { key: "main-text", width: 50, height: 28, borderRadius: 5 },
            ]}
            boneColor={"rgba(255,255,255,.25)"}
          />
        ) : (
          <Text
            allowFontScaling={false}
            style={[
              themeMode === ThemeMode.Dark
                ? styles.title
                : { ...styles.title, color: theme.lightMode.colors.blueDark },
            ]}
          >
            {title}
          </Text>
        )}
        {message && (
          <Text
            allowFontScaling={false}
            style={[
              themeMode === ThemeMode.Dark
                ? styles.description
                : {
                    ...styles.description,
                    color: theme.lightMode.colors.blueDark,
                  },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
      {loading ? (
        <SkeletonContent
          containerStyle={{
            flex: 1,
            width: 50,
            height: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          layout={[
            { key: "caption-text", width: 50, height: 14, borderRadius: 5 },
          ]}
          boneColor={"rgba(255,255,255,.25)"}
        />
      ) : (
        <>
          {caption && (
            <Text
              allowFontScaling={false}
              style={[
                themeMode === ThemeMode.Dark
                  ? styles.caption
                  : {
                      ...styles.caption,
                      color: theme.lightMode.colors.blueDark,
                    },
              ]}
            >
              {caption}
            </Text>
          )}
          {!caption && (
            <Text
              allowFontScaling={false}
              style={{ ...styles.caption, opacity: 0 }}
            >
              {"-"}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  containerBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    justifyContent: "space-between",
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderColor: "#00FFC2",
    borderWidth: 0.5,
    borderRadius: 14,
    backgroundColor: theme.colors.mainBackground,
    width: "100%",
  },
  title: {
    color: theme.colors.textContrast,
    textAlign: "center",
    ...theme.textVariants.inputCode,
  },
  description: {
    color: theme.colors.textContrast,
    textAlign: "center",
    ...theme.textVariants.descriptionCard,
  },
  caption: {
    fontWeight: "600",
    color: theme.colors.contrast,
    textAlign: "center",
    ...theme.textVariants.captionCard,
  },
});
