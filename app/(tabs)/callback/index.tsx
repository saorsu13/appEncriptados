import HeaderPage from "@/components/molecules/HeaderPage/HeaderPage";
import CardIcon from "@/components/molecules/CardIcon/CardIcon";

import SwitchCard from "@/components/molecules/SwitchCard";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import theme from "@/config/theme";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChangeCallback } from "@/features/callback/useCallback";
import { updateCallback } from "@/features/callback/callbackSlice";
import useModalAll from "@/hooks/useModalAll";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useFocusEffect } from "expo-router";
import { useAppSelector } from "@/hooks/hooksStoreRedux";

const baseMsg = "pages.callback";

const Callback = () => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const currentSim = useSelector((state: any) => state.sims.currentSim);
  const currentCallback = useAppSelector((state) => state.callback.callback);
  const [callback, setCallback] = useState(currentCallback);
  const [prevCallback, setPrevCallback] = useState(currentCallback || false);

  useEffect(() => {}, [currentCallback]);

  useFocusEffect(
    useCallback(() => {
      setCallback(currentCallback);
    }, [currentCallback])
  );

  useFocusEffect(useCallback(() => {}, []));

  const dispatch = useDispatch();
  const { showModal } = useModalAll();

  const modalMessageByCallbackStatus = (callback: boolean) => {
    if (!callback) {
      return t("modalCallback.successful");
    } else {
      return t("modalCallback.successfuldesactivate");
    }
  };

  const handleError = useCallback(() => {
    showModal({
      type: "error",
      oneButton: true,
      title: t("type.error"),
      description: t("modalCallback.error"),
      textConfirm: t("actions.right"),
      buttonColorConfirm: "#CB0808",
    });
    setCallback(prevCallback);
  }, [prevCallback, showModal]);

  const handleOnCompleted = useCallback(() => {
    showModal({
      type: "confirm",
      oneButton: true,
      title: t("modalCallback.title"),
      description: modalMessageByCallbackStatus(callback),
      textConfirm: t("actions.right"),
      buttonColorConfirm: "#10B4E7",
    });
  }, [showModal]);

  const query = useChangeCallback(
    currentSim?.idSim,
    callback,
    handleError,
    handleOnCompleted
  );

  const handleCallback = (value) => {
    setPrevCallback(callback);
    setCallback(value);
    query.refetch();
  };

  return (
    <ScrollView
      style={
        themeMode === ThemeMode.Dark
          ? null
          : { backgroundColor: theme.lightMode.colors.white }
      }
    >
      <HeaderEncrypted iconBack="/home" title={t(`${baseMsg}.title`)} />

      <View style={styles.containerBody}>
        <CardIcon>
          <IconSvg
            color={theme.colors.iconDefault}
            type="callback"
            width={50}
            height={50}
          />
        </CardIcon>
        <View
          style={[
            themeMode === ThemeMode.Dark
              ? styles.descriptionCard
              : {
                  ...styles.descriptionCard,
                  backgroundColor: theme.lightMode.colors.blueDark,
                },
          ]}
        >
          <Text allowFontScaling={false} style={styles.descriptionTitle}>
            {t(`${baseMsg}.callback`)}
          </Text>
          <Text allowFontScaling={false} style={styles.descriptionMessage}>
            {t(`${baseMsg}.callbackDescription`)}
          </Text>
        </View>
        <SwitchCard
          label={t(`${baseMsg}.callback`)}
          onChange={handleCallback}
          defaultValue={callback}
          value={callback}
        />
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
