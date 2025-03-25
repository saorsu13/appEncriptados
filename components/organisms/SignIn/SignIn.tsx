import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useFormik } from "formik";
import InputField from "@/components/molecules/InputField/InputFIeld";

import Button from "@/components/atoms/Button/Button";
import theme from "@/config/theme";
import StepList from "@/components/molecules/StepList/StepList";
import VerificationSim from "@/components/organisms/VerificationSim/VerificationSim";
import { useAuth } from "@/context/auth";
import { useLogin } from "@/features/sign-in/useLogin";
import { determineType } from "@/utils/utils";
import { router, useFocusEffect } from "expo-router";
import { useDispatch } from "react-redux";
import api from "@/config/api";
import VerificationModal from "@/components/molecules/VerificationModal/VerificationModal";
import VerificationInput from "@/components/molecules/VerificationDigit/VerificationDigit";

import ModalInfo from "@/components/molecules/ModalInfo";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useModalActivateSim } from "@/context/modalactivatesim";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { resetModalUpdate } from "@/features/settings/settingsSlice";

import { getSubscriberData } from "@/api/subscriberApi";

const LoginHeaderImage = require("@/assets/images/login-header.png");
const LoginHeaderImageLight = require("@/assets/images/login-header-light.png");

const SignIn = () => {
  const {
    setCurrentIdSim,
    currentIdSim,
    currentSimCode,
    typeOfProcess,
    showModal,
    setTypeOfProcess,
  } = useModalActivateSim();

  useFocusEffect(
    useCallback(() => {
      setTypeOfProcess("signin");
    }, [])
  );

  const { themeMode, toggleThemeMode } = useDarkModeTheme();
  const [requestCodeModal, setRequestCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<any>(false);
  const { t } = useTranslation();
  const baseMsg = "pages.login";
  const loginQuery = useLogin();
  const auth = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    simName: Yup.string(),
    simNumber: Yup.string()
      .required(t("validators.required"))
      .test("len", t("validators.invalidSim"), (val) => val.length === 6),
  });

  const handleSubmit = (values) => {
    showModal();
  };

  const formik = useFormik({
    initialValues: {
      simName: "SIM 1",
      simNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Formik Values =>", values);
  
      try {
        console.log("Llamando a getSubscriberData con =>", values.simNumber);
  
        const data = await getSubscriberData(values.simNumber);
  
        console.log("Respuesta del endpoint =>", data);
  
        const firstProvider = data?.providers?.[0]?.provider;
        console.log("Primer provider =>", firstProvider);
  
        if (firstProvider === "telco-vision") {
          router.push("/balance");
        } else {
          router.push("/new-sim");
        }
      } catch (error) {
        console.log("Error validando SIM:", error);
      }
    },
  });
  

  useEffect(() => {
    setCurrentIdSim(formik.values.simNumber);
  }, [formik.values.simNumber, formik.values.Name]);

  useEffect(() => {
    setType(determineType(formik.values.simNumber));
  }, [formik.values.simNumber]);

  const handleInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleInfoHowToWorkModal = () => {
    setModalHowToWorkVisible(!modalHowToWorkVisible);
  };

  useEffect(() => {
    if (auth.isLoggedIn) {
      router.push("/home/");
    }
  }, [auth]);

  const stateModal = useAppSelector((state) => {
    return state.modalReset.modalReset;
  });

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <HeaderEncrypted settingsLink="/settings-sign" />
      <View
        style={[
          themeMode === ThemeMode.Dark
            ? styles.container
            : {
                ...styles.container,
                backgroundColor: theme.lightMode.colors.cyanSuperLight,
              },
        ]}
      >
        <View style={{ gap: 50 }}>
          <View style={styles.containerHeader}>
            <ImageBackground
              source={
                themeMode === ThemeMode.Dark
                  ? LoginHeaderImage
                  : LoginHeaderImageLight
              }
              resizeMode="cover"
              imageStyle={styles.background}
            >
              <View style={styles.containerHeaderImage}>
                <Text
                  allowFontScaling={false}
                  style={styles.containerHeaderTitle}
                >
                  {t(`${baseMsg}.header.title`)}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.containerHeaderMessage}
                >
                  {t(`${baseMsg}.header.message`)}
                </Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.containerForm}>
            <View style={styles.containerTitleForm}>
              <Text
                allowFontScaling={false}
                style={[
                  themeMode === ThemeMode.Dark
                    ? styles.titleForm
                    : { ...styles.titleForm, color: theme.colors.darkBlack },
                ]}
              >
                {t(`${baseMsg}.form.title`)}
              </Text>
              <Pressable onPress={handleInfoHowToWorkModal}>
                <Text
                  allowFontScaling={false}
                  style={[
                    themeMode === ThemeMode.Dark
                      ? styles.titleLink
                      : { ...styles.titleLink, color: theme.colors.darkBlack },
                  ]}
                >
                  {t(`${baseMsg}.form.link`)}
                </Text>
              </Pressable>
            </View>
            <View style={styles.containerFormFields}>
            <InputField
              label="Número de SIM"
              onChangeText={formik.handleChange("simNumber")}
              onBlur={formik.handleBlur("simNumber")}
              value={formik.values.simNumber}
              error={formik.touched.simNumber ? formik.errors.simNumber : null}
              maxLength={6}
              placeholder="Ingresa tu número de SIM"
            />

              <InputField
                label={t(`${baseMsg}.fields.sim.label`)}
                onChangeText={formik.handleChange("simNumber")}
                handleBlur={formik.handleBlur("simNumber")}
                value={formik.values.simNumber}
                error={
                  formik.touched.simNumber ? formik.errors.simNumber : null
                }
                required={true}
                placeholder={t(`${baseMsg}.fields.sim.placeholder`)}
                suffixIcon={
                  <IconSvg
                    color={
                      themeMode === ThemeMode.Dark
                        ? theme.colors.iconDefault
                        : "#A1A1A1"
                    }
                    height={25}
                    width={25}
                    type="info"
                  />
                }
                inputMode="numeric"
                maxLength={6}
                status={
                  type
                    ? "success"
                    : formik.values.simNumber.length === 6
                    ? "info"
                    : null
                }
                statusMessage={
                  !type
                    ? t(`${baseMsg}.fields.sim.invalidSim`)
                    : t(`${baseMsg}.fields.sim.${type}Sim`)
                }
                onPressIcon={handleInfoModal}
              />
            </View>
            <Button
              onClick={formik.handleSubmit}
              variant="primaryPress"
              disabled={type === false}
            >
              <Text allowFontScaling={false} style={styles.loadingButton}>
                {t(`${baseMsg}.actions.requestCode`)}
              </Text>
            </Button>
            <StepList
              title={t(`${baseMsg}.form.stepsList.title`)}
              items={[
                t(`${baseMsg}.form.stepsList.step1`),
                t(`${baseMsg}.form.stepsList.step2`),
                t(`${baseMsg}.form.stepsList.step3`),
              ]}
            />
          </View>
        </View>
        {requestCodeModal && (
          <VerificationSim
            showModal={requestCodeModal}
            validateCode={validateCode}
            resetModal={() => setRequestCodeModal(false)}
            isLoading={isLoading}
          />
        )}

        <ModalInfo
          visible={modalHowToWorkVisible}
          onClose={handleInfoHowToWorkModal}
          title={t(`${baseMsg}.helpMessages.howToWorkHelpTittle`)}
          description={t(`${baseMsg}.helpMessages.howToWorkHelpMessage`)}
          buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)}
        />
        <ModalInfo
          visible={modalVisible}
          onClose={handleInfoModal}
          title={t(`${baseMsg}.helpMessages.SimHelpTittle`)}
          description={t(`${baseMsg}.helpMessages.SimHelpMessage`)}
          buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)}
        />

        <ModalInfo
          visible={stateModal}
          onClose={() => dispatch(resetModalUpdate(false))}
          title={t("pages.home.titleResetDevice")}
          description={t("pages.home.descriptionResetDevice")}
          buttonText={t("actions.right")}
        />
      </View>
    </ScrollView>
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
  containerHeaderBar: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  notificationsButton: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: theme.colors.roundedGray,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
  containerAction: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  iconButton: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: theme.colors.roundedGray,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
});
