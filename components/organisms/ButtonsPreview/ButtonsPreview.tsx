import Button from "@/components/atoms/Button/Button";
import theme from "@/config/theme";
import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";

const ButtonsPreview = () => {
  return (
    <View style={styles.container}>
      <Button onClick={() => {}} variant="primaryPress">
        <Text allowFontScaling={false} style={styles.loadingButton}>
          Primary
          <ActivityIndicator size="small" color={theme.colors.contrast} />
        </Text>
      </Button>
      <Button onClick={() => {}}>Primary press</Button>
      <Button onClick={() => {}} variant={"secondary"}>
        Secondary
      </Button>
      <Button onClick={() => {}} variant={"dark"}>
        Dark
      </Button>
      <Button onClick={() => {}} variant={"delete"}>
        Delete
      </Button>
      <Button onClick={() => {}} variant={"light"}>
        Light
      </Button>
    </View>
  );
};

export default ButtonsPreview;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  loadingButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
