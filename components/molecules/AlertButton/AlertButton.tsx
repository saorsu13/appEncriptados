import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import theme from "@/config/theme";
import IconSvg from "../IconSvg/IconSvg";

type Props = {
  message: string;
  type: "success" | "error" | "warning";
  showIcon?: boolean;
  onPress?: () => void; // Agregar onPress para manejar el clic
};

const AlertButton = ({ message, type, onPress }: Props) => {
  const translateY = useRef(new Animated.Value(50)).current; // Initial position below the screen
  const opacity = useRef(new Animated.Value(0)).current; // Initial opacity

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          container: styles.successContainer,
          title: styles.successTitle,
        };
      case "error":
        return {
          container: styles.errorContainer,
          title: styles.errorTitle,
        };
      case "warning":
        return {
          container: styles.warningContainer,
          title: styles.warningTitle,
        };
      default:
        return {
          container: styles.defaultContainer,
          title: styles.defaultTitle,
        };
    }
  };

  const currentStyles = getStyles(type);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.container,
          currentStyles.container,
          { transform: [{ translateY }], opacity },
        ]}
      >
        <View style={styles.content}>
          <Text
            allowFontScaling={false}
            style={[styles.title, currentStyles.title]}
          >
            {message}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default AlertButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 15,
  },
  content: {
    width: "100%",
  },
  title: { textAlign: "center" },
  description: {},
  successContainer: {
    backgroundColor: "#EEF5E7",
  },
  successTitle: {
    color: "#44C200",
  },
  successDescription: {
    color: "#44C200",
  },
  errorContainer: {
    backgroundColor: "#FFECF2",
  },
  errorTitle: {
    color: "#E2034D",
  },
  errorDescription: {
    color: "#E2034D",
  },
  warningContainer: {
    backgroundColor: "#FEF4E5",
  },
  warningTitle: {
    color: "#F39200",
  },
  warningDescription: {
    color: "#F39200",
  },
  defaultContainer: {
    backgroundColor: "#FFF",
  },
  defaultTitle: {
    color: "#000",
  },
  defaultDescription: {
    color: "#000",
  },
});
