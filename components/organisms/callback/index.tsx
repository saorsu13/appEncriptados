import CardIcon from "@/components/molecules/CardIcon/CardIcon";

import SwitchCard from "@/components/molecules/SwitchCard";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import theme from "@/config/theme";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";

const baseMsg = "pages.callback";

const Callback = () => {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <HeaderEncrypted title={t(`${baseMsg}.title`)} />

      <View style={styles.containerBody}>
        <CardIcon>
          <IconSvg height={50} width={50} type="callback" />
        </CardIcon>
        <View style={styles.descriptionCard}>
          <Text allowFontScaling={false} style={styles.descriptionTitle}>
            {t(`${baseMsg}.callback`)}
          </Text>
          <Text allowFontScaling={false} style={styles.descriptionMessage}>
            {t(`${baseMsg}.callbackDescription`)}
          </Text>
        </View>
        <SwitchCard label={t(`${baseMsg}.callback`)} onChange={() => {}} />
      </View>
    </ScrollView>
  );
};

export default Callback;

const styles = StyleSheet.create({
  containerBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  descriptionCard: {
    backgroundColor: theme.colors.mainBackground,
    borderRadius: 8,
    display: "flex",
    gap: 15,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  descriptionTitle: {
    color: theme.colors.listTitle,
    ...theme.textVariants.button,
  },
  descriptionMessage: {
    color: theme.colors.contentSummary,
    ...theme.textVariants.input,
  },
});
