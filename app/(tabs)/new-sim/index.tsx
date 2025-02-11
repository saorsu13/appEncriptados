import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
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
import ModalInfo from "@/components/molecules/ModalInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alert from "@/components/molecules/Alert";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";

import { useModalPassword } from "@/context/modalpasswordprovider";
import AlertButton from "@/components/molecules/AlertButton/AlertButton";
import { router, useFocusEffect } from "expo-router";
import InsertSimCardModal from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";
import { useModalActivateSim } from "@/context/modalactivatesim";

const LoginHeaderImage = require("@/assets/images/new-sim-hero.png");

const Login = () => {
  const { setTypeOfProcess, showModal, setCurrentIdSim, typeOfProcess } =
    useModalActivateSim();
  const { isModalVisible } = useModalPassword();

  useFocusEffect(
    useCallback(() => {
      setTypeOfProcess("newsim");
    }, [])
  );

  const [requestCodeModal, setRequestCodeModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlertButton, setShowAlertButton] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<any>(false);
  const { t } = useTranslation();
  const baseMsg = "pages.login";
  const loginQuery = useLogin();
  const auth = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);
  const { themeMode } = useDarkModeTheme();

  const validationSchema = Yup.object().shape({
    simNumber: Yup.string()
      .required(t("validators.required"))
      .test("len", t("validators.invalidSim"), (val) => val.length === 6),
  });

  const handleSubmit = (values) => {
    if (Object.keys(formik.errors).length > 0) {
      setRequestCodeModal(false);
      return;
    }
    setRequestCodeModal(true);
  };

  useEffect(() => {
    const fetchPersistedState = async () => {
      try {
        const persistedState = await AsyncStorage.getItem("root");
        if (persistedState !== null) {
          const state = JSON.parse(persistedState);
        }
      } catch (error) {
        console.error("Error al obtener el estado persistido:", error);
      }
    };

    fetchPersistedState();
  }, []);

  const formik = useFormik({
    initialValues: {
      simNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    setCurrentIdSim(formik.values.simNumber);
  }, [formik.values.simNumber]);

  const validateCode = async (code) => {
    setIsLoading(true);
    setAlertMessage("");
    setAlertType("");
    setShowAlertButton(false);

    let successMessage = "";

    try {
      const query = await loginQuery.loginRequest(
        formik.values.simNumber,
        code,
        "SIM"
      );

      if (query.error) {
        successMessage = "SIM o Código no válido. Vuelve a intentarlo";
        setAlertType("error");
      } else {
        successMessage = `SIM activada. Undir aquí para acceder a la configuración de la SIM recién añadida.`;
        setAlertType("success");

        formik.resetForm();
      }
    } catch (error) {
      successMessage = "Ocurrió un error al realizar la petición";

      setAlertType("error");
    }

    setAlertMessage(successMessage);
    setIsLoading(false);
    setRequestCodeModal(false);
    setShowAlertButton(true);
    return successMessage;
  };

  useEffect(() => {
    setType(determineType(formik.values.simNumber));
  }, [formik.values.simNumber]);

  useEffect(() => {
    if (alertMessage) {
      setShowAlertButton(true);
    } else {
      setShowAlertButton(false);
    }
  }, [alertMessage]);

  const handleInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleInfoHowToWorkModal = () => {
    setModalHowToWorkVisible(!modalHowToWorkVisible);
  };

  const { colors } = useTheme<ThemeCustom>();

  useFocusEffect(
    useCallback(() => {
      formik.resetForm();
    }, [])
  );

  return (
    <ScrollView>
      <HeaderEncrypted title={t(`pages.newSim.pageTitle`)} iconBack="/home" />

      <View
        style={[
          styles.container,
          {
            backgroundColor:
              themeMode === "dark" ? "#000" : theme.lightMode.colors.white,
          },
        ]}
      >
        <View style={styles.containerHeader}>
          <ImageBackground
            source={LoginHeaderImage}
            resizeMode="cover"
            imageStyle={styles.background}
          >
            <View style={styles.containerHeaderImage}>
              <Text
                allowFontScaling={false}
                style={styles.containerHeaderTitle}
              >
                {t(`pages.newSim.title`)}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.containerForm}>
          <View style={styles.containerTitleForm}>
            <Text
              allowFontScaling={false}
              style={[
                styles.titleForm,
                {
                  color:
                    themeMode === "dark"
                      ? theme.colors.textContrast
                      : "#454545",
                },
              ]}
            >
              {t(`${baseMsg}.form.title`)}
            </Text>
            <Pressable
              onPress={handleInfoHowToWorkModal}
              style={{ display: "flex" }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleLink,
                  {
                    color:
                      themeMode === "dark"
                        ? theme.colors.textContrast
                        : "#454545",
                  },
                ]}
              >
                {t(`${baseMsg}.form.link`)}
              </Text>
            </Pressable>
          </View>
          <View style={styles.containerFormFields}>
            <InputField
              label={t(`${baseMsg}.fields.sim.label`)}
              onChangeText={formik.handleChange("simNumber")}
              handleBlur={formik.handleBlur("simNumber")}
              value={formik.values.simNumber}
              error={formik.touched.simNumber ? formik.errors.simNumber : null}
              required={true}
              placeholder={t(`${baseMsg}.fields.sim.placeholder`)}
              suffixIcon={
                <IconSvg
                  width={25}
                  height={25}
                  type="info"
                  color={theme.colors.contrast}
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
          {showAlertButton && (
            <AlertButton
              onPress={() => {
                if (alertType === "success") {
                  setAlertMessage("");
                  router.push("/home");
                }
              }}
              message={alertMessage}
              type={alertType as any}
            />
          )}
          <Button
            onClick={() => showModal()}
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
          <Alert
            description={t("pages.home.useFive")}
            message=""
            showIcon
            type="warning"
          />
        </View>
      </View>
      {/* 
      {requestCodeModal && (
        <VerificationSim
          showModal={requestCodeModal}
          validateCode={validateCode}
          resetModal={() => setRequestCodeModal(false)}
          isLoading={isLoading}
          addNewSimDisabled={true}
        />
      )} */}

      <ModalInfo
        visible={modalHowToWorkVisible}
        onClose={handleInfoHowToWorkModal}
        title={t(`${baseMsg}.helpMessages.howToWorkHelpTittle`)}
        description={t(`${baseMsg}.helpMessages.howToWorkHelpMessage`)}
        buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)}
      />
    </ScrollView>
  );
};

export default Login;

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
    color: theme.colors.contrast,
    fontFamily: theme.textVariants.input,
    textAlign: "center",
    ...theme.textVariants.buttonGroup,
  },
  background: {
    aspectRatio: 2.196,
    borderRadius: 18,
    height: 158,
    width: "100%",
  },
});
