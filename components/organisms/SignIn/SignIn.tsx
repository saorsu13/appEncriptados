import React, { useCallback, useEffect, useRef, useState } from "react";
import { Redirect, router, useFocusEffect } from "expo-router";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  Pressable,
  InteractionManager,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

import InputField from "@/components/molecules/InputField/InputFIeld";
import Button from "@/components/atoms/Button/Button";
import StepList from "@/components/molecules/StepList/StepList";
import ModalInfo from "@/components/molecules/ModalInfo";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";

import { setHasAlreadyRedirected } from "@/utils/navigation";
import { useAuth } from "@/context/auth";
import { useLogin } from "@/features/sign-in/useLogin";
import { determineType } from "@/utils/utils";
import { getSubscriberData } from "@/api/subscriberApi";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { useModalActivateSim } from "@/context/modalactivatesim";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { useDispatch } from "react-redux";
import { resetModalUpdate } from "@/features/settings/settingsSlice";
import { setHasRedirectedFromTottoli } from "@/utils/redirectionControl";
import theme from "@/config/theme";

const LoginHeaderImage = require("@/assets/images/login-header.png");
const LoginHeaderImageLight = require("@/assets/images/login-header-light.png");

const SignIn = () => {
  const { setCurrentIdSim, setTypeOfProcess } = useModalActivateSim();
  const { isLoggedIn, isLoading: authLoading, user } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [requestCodeModal, setRequestCodeModal] = useState(false);
  const [simType, setSimType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);

  const dispatch = useDispatch();
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const baseMsg = "pages.login";
  const loginQuery = useLogin();
  const deviceUUID = useDeviceUUID();
  const inputRef = useRef<TextInput>(null);

  const validationSchema = Yup.object().shape({
    simNumber: Yup.string()
      .required(t("validators.required"))
      .test("len", t("validators.invalidSim"), (val) => val.length === 6 || val.length === 19),
  });

  const formik = useFormik({
    initialValues: { simNumber: "" },
    validationSchema,
    onSubmit: async (values) => {
      setCurrentIdSim(values.simNumber);
      try {
        setLocalLoading(true);

        if (!deviceUUID) {
          console.warn("⛔ UUID aún no disponible. Intenta de nuevo.");
          setTimeout(() => formik.handleSubmit(), 300);
          return;
        }

        const response = await loginQuery.loginRequest(values.simNumber, 0, values.simNumber);

        if (response?.error) {
          console.warn("⚠️ Error durante loginRequest:", response.error);
          setRequestCodeModal(true);
          return;
        }

        const provider = response?.data?.provider;
        if (!provider) {
          console.warn("⚠️ Provider no reconocido o ausente:", provider);
          setRequestCodeModal(true);
          return;
        }
        InteractionManager.runAfterInteractions(() => {
          console.log("🔁 [SignIn] Redirigiendo a Home. La lógica decidirá si ir a /balance.");
          setHasRedirectedFromTottoli(false);
          setHasAlreadyRedirected(true);
          router.replace("/home");
        });        
      } catch (error) {
        console.error("🔥 Error general en onSubmit:", error);
      } finally {
        setLocalLoading(false);
      }
    },
  });

  useEffect(() => {
    const sim = formik.values.simNumber;
    setCurrentIdSim(sim);
    setSimType(determineType(sim));
  }, [formik.values.simNumber, deviceUUID]);

  useFocusEffect(
    useCallback(() => {
      setTypeOfProcess("signin");
    }, [])
  );

  const shouldRedirect = isLoggedIn && user?.idSim && user?.provider ? user.provider : null;
  const stateModal = useAppSelector((state) => state.modalReset.modalReset);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <HeaderEncrypted owner="encriptados" settingsLink="/settings-sign" />
        <View style={[themeMode === ThemeMode.Dark ? styles.container : { ...styles.container, backgroundColor: theme.lightMode.colors.cyanSuperLight }]}>
          <View style={{ gap: 50 }}>
            <View style={styles.containerHeader}>
              <ImageBackground source={themeMode === ThemeMode.Dark ? LoginHeaderImage : LoginHeaderImageLight} resizeMode="cover" imageStyle={styles.background}>
                <View style={styles.containerHeaderImage}>
                  <Text allowFontScaling={false} style={styles.containerHeaderTitle}>{t(`${baseMsg}.header.title`)}</Text>
                  <Text allowFontScaling={false} style={styles.containerHeaderMessage}>{t(`${baseMsg}.header.message`)}</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.containerForm}>
              <View style={styles.containerTitleForm}>
                <Text allowFontScaling={false} style={[themeMode === ThemeMode.Dark ? styles.titleForm : { ...styles.titleForm, color: theme.colors.darkBlack }]}>
                  {t(`${baseMsg}.form.title`)}</Text>
                <Pressable onPress={() => setModalHowToWorkVisible(true)}>
                  <Text allowFontScaling={false} style={[themeMode === ThemeMode.Dark ? styles.titleLink : { ...styles.titleLink, color: theme.colors.darkBlack }]}>
                    {t(`${baseMsg}.form.link`)}</Text>
                </Pressable>
              </View>

              <View style={styles.containerFormFields}>
                <InputField
                  ref={inputRef}
                  label={t(`${baseMsg}.fields.sim.label`)}
                  onChangeText={formik.handleChange("simNumber")}
                  handleBlur={formik.handleBlur("simNumber")}
                  value={formik.values.simNumber}
                  error={formik.touched.simNumber ? formik.errors.simNumber : null}
                  required
                  placeholder={t(`${baseMsg}.fields.sim.placeholder`)}
                  suffixIcon={<IconSvg color={themeMode === ThemeMode.Dark ? theme.colors.iconDefault : "#A1A1A1"} height={25} width={25} type="info" />}
                  inputMode="numeric"
                  status={simType ? "success" : formik.values.simNumber.length > 0 ? "info" : null}
                  statusMessage={!simType ? t(`${baseMsg}.fields.sim.invalidSim`) : t(`${baseMsg}.fields.sim.${simType}Sim`)}
                  onPressIcon={() => setModalVisible(true)}
                />
              </View>

              <Button
                onClick={() => {
                  inputRef.current?.focus();
                  formik.handleSubmit();
                }}
                variant="primaryPress"
                disabled={!formik.isValid || !formik.values.simNumber}
              >
                {localLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text allowFontScaling={false} style={styles.loadingButton}>
                    {formik.values.simNumber.length === 19 ? "Activar SIM" : "Solicitar código"}
                  </Text>
                )}
              </Button>

              <StepList title={t(`${baseMsg}.form.stepsList.title`)} items={[t(`${baseMsg}.form.stepsList.step1`), t(`${baseMsg}.form.stepsList.step2`), t(`${baseMsg}.form.stepsList.step3`)]} />
            </View>
          </View>

          <ModalInfo visible={modalHowToWorkVisible} onClose={() => setModalHowToWorkVisible(false)} title={t(`${baseMsg}.helpMessages.howToWorkHelpTittle`)} description={t(`${baseMsg}.helpMessages.howToWorkHelpMessage`)} buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)} />
          <ModalInfo visible={modalVisible} onClose={() => setModalVisible(false)} title={t(`${baseMsg}.helpMessages.SimHelpTittle`)} description={t(`${baseMsg}.helpMessages.SimHelpMessage`)} buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)} />
          <ModalInfo visible={stateModal} onClose={() => dispatch(resetModalUpdate(false))} title={t("pages.home.titleResetDevice")} description={t("pages.home.descriptionResetDevice")} buttonText={t("actions.right")} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 50,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  containerForm: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  containerFormFields: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  loadingButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  containerTitleForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleForm: {
    color: theme.colors.textContrast,
    ...theme.textVariants.modalSummary,
  },
  titleLink: {
    borderBottomWidth: 0.3,
    borderBottomColor: theme.colors.textLInk,
    color: theme.colors.textLInk,
    ...theme.textVariants.descriptionCard,
  },
  containerHeader: {
    display: "flex",
    gap: 20,
  },
  containerHeaderImage: {
    aspectRatio: 2.196,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 158,
  },
  containerHeaderTitle: {
    width: "100%",
    color: theme.colors.contrast,
    fontFamily: theme.textVariants.input,
    textAlign: "center",
    ...theme.textVariants.buttonGroup,
  },
  containerHeaderMessage: {
    color: theme.colors.messageHeader,
    textAlign: "center",
    ...theme.textVariants.contentSummary,
    paddingHorizontal: 35,
  },
  background: {
    aspectRatio: 2.196,
    borderRadius: 18,
    height: 158,
    width: "100%",
  },
});