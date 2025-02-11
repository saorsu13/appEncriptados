import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";

const SkeletonGrid = ({
  columns = 2,
  rows = 2,
  gap = 10,
  boneColor = "rgba(255, 255, 255, 0.25)",
  borderRadius = 8,
  widthImage,
  heightImage,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    const animateLoading = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateLoading();

    return () => {
      animatedValue.setValue(0);
    };
  }, []);

  const interpolatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const itemSize = (windowWidth - gap * (columns + 1)) / columns;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      marginLeft: 10,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
    },
    gridItem: {
      width: itemSize,
      height: itemSize * (heightImage / widthImage),
      marginBottom: gap,
      backgroundColor: boneColor,
      borderRadius: borderRadius,
      marginRight: gap,
      opacity: interpolatedOpacity,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {Array.from({ length: rows * columns }, (_, index) => (
          <Animated.View key={index} style={styles.gridItem} />
        ))}
      </View>
    </View>
  );
};

export default SkeletonGrid;
