import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const Skeleton2x2 = ({ containerStyle, layout = [], boneColor = "gray" }) => {
  const animation = new Animated.Value(0);

  const { colors } = useTheme<ThemeCustom>();

  const startAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.strokeBorder, "gray"], // Cambiar el color a un color ligeramente más claro para la animación
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {layout.map((item, index) => (
        <Animated.View
          key={index}
          style={[
            styles.item,
            item,
            { backgroundColor: animatedBackgroundColor },
          ]}
        ></Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  item: {
    margin: 1,
    height: 50,
    width: 50,
  },
});

export default Skeleton2x2;
