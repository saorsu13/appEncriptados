import theme from "@/config/theme";
import { useModalActivateSim } from "@/context/modalactivatesim";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

const VerificationInputSim = () => {
  const { setCurrentSimCode } = useModalActivateSim();

  const [digits, setDigits] = useState(["", "", "", ""]);

  useEffect(() => {
    setCurrentSimCode(+digits.join(""));
  }, [digits, setCurrentSimCode]);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [code, setCode] = useState("");

  const handleChange = (index, value) => {
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
  };

  const handleKeyDown = (e, index) => {
    if (
      (e.key === "Backspace" || e.nativeEvent.key === "Backspace") &&
      digits[index] === ""
    ) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      if (index - 1 >= 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  useEffect(() => {
    const code = digits.join().replaceAll(",", "");
    setCode(code.length == 4 ? code : "");
  }, [digits]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {digits.map((digit, index) => (
          <TextInput
            allowFontScaling={false}
            key={index}
            maxLength={1}
            value={digit}
            onChangeText={(value) => {
              if (/^\d*$/.test(value)) {
                handleChange(index, value);
                if (value !== "" && index < digits.length - 1) {
                  inputRefs[index + 1].current.focus();
                }
              }
            }}
            onKeyPress={(e) => handleKeyDown(e, index)}
            ref={inputRefs[index]}
            inputMode="numeric"
            style={styles.input}
          />
        ))}
      </View>
    </View>
  );
};

export default VerificationInputSim;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-evenly",
  },
  input: {
    aspectRatio: 0.901,
    borderWidth: 1,
    borderColor: theme.colors.complementaryText,
    borderRadius: 8,
    backgroundColor: theme.colors.contrastBackground,
    color: theme.colors.complementaryText,

    flex: 1,
    textAlign: "center",

    ...theme.textVariants.inputCode,
  },
  codeText: {
    marginTop: 16,
    ...theme.textVariants.inputCode,
  },
});
