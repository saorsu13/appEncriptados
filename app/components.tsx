import SoundsFilter from "@/components/organisms/SoundsFilter/SoundsFilter";
import theme from "@/config/theme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import BalanceDetails from "@/components/organisms/BalanceDetails/BalanceDetails";

import ButtonsPreview from "@/components/organisms/ButtonsPreview/ButtonsPreview";

import InputsPreview from "@/components/organisms/InputsPreview/InputsPreview";
import Dropdown from "@/components/molecules/Dropdown/Dropdown";

import ButtonGroup from "@/components/molecules/ButtonGroup/ButtonGroup";

import CopyLabel from "@/components/molecules/CopyLabel/CopyLabel";
import { router } from "expo-router";
import SimListModal from "@/components/molecules/SimListModal/SimListModal";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";

export default function TabOneScreen() {
  const { t, i18n } = useTranslation();
  const [lang, onChangeLang] = useState("es");

  const [countryValue, setCountryValue] = useState(null);
  const handleCountryValue = (value: string | number) => {
    setCountryValue(value);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text allowFontScaling={false} style={styles.textLabel}>
            Language test: {t("hello_world")}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeLang}
            value={lang}
            placeholder="language code"
          />
          <Button title="Change" onPress={() => i18n.changeLanguage(lang)} />
        </View>

        <Button title="Sign in" onPress={() => router.push("/sign-in/")} />

        <SoundsFilter />

        <InputsPreview />
        <BalanceDetails />
        <Dropdown
          label="PAÍS"
          items={[
            {
              label: "Canada",
              value: "CAD",
              icon: () => <IconSvg width={25} height={25} type="countrycad" />,
            },
            {
              label: "Colombia",
              value: "COP",
              icon: () => <IconSvg width={25} height={25} type="countrycad" />,
            },
            {
              label: "Argentina",
              value: "AR",
              icon: () => <IconSvg width={25} height={25} type="countrycad" />,
            },
          ]}
          value={countryValue}
          handleValue={handleCountryValue}
          placeholder={t("molecules.dropdown.placeholder")}
        />

        <CopyLabel textValue={"782903"} />

        {/* <VerificationSim />*/}

        <ButtonsPreview />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: theme.colors.cardPrimaryBackground,
    color: theme.colors.cardPrimaryBackground,
  },
  container: {
    backgroundColor: theme.colors.mainBackground,
    //flex: 1,
    padding: 10,
    gap: 20,
    //overflow: "scroll",
  },
  textLabel: {
    color: theme.colors.cardPrimaryBackground,
  },
});
