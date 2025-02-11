import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import StepperCard from "./StepperCard";
import IconSvg from "../IconSvg/IconSvg";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";

const Stepper = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { colors } = useTheme<ThemeCustom>();
  const icons = ["money", "shopstepper", "checkstepper"];

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <View style={styles.container}>
      <StepperCard
        cardinfo={steps[currentStep].cardinfo}
        vectorcomponent={steps[currentStep].vectorcomponent}
        stepNumber={steps[currentStep].stepNumber}
        title={steps[currentStep].title}
      />
      <View style={styles.stepDotsContainer}>
        <View style={styles.stepDots}>
          {steps.map((step, index) => {
            const isSelected = index === currentStep;

            return (
              <View key={index} style={styles.stepItem}>
                <TouchableOpacity onPress={() => goToStep(index)}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isSelected ? "#CCEFFF" : "transparent",
                        borderColor: isSelected ? "#CCEFFF" : colors.blueLight,
                      },
                    ]}
                  >
                    <IconSvg
                      height={100}
                      color={isSelected ? "#103B4B" : colors.blueLight}
                      //@ts-ignore
                      type={icons[index % icons.length]}
                    />
                  </View>
                </TouchableOpacity>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.separator,
                      {
                        backgroundColor: isSelected
                          ? "#CCEFFF"
                          : colors.blueLight,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.titleContainer}>
          <Text
            allowFontScaling={false}
            style={{ ...styles.title, color: colors.primaryText }}
          >
            {steps[currentStep].title}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  stepDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  separator: {
    width: 40,
    height: 2,
    marginHorizontal: 5,
  },
  titleContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default Stepper;
