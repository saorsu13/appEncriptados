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
import { router, useFocusEffect } from "expo-router";
import { useDispatch } from "react-redux";
import { getSubscriberData } from "@/api/subscriberApi";
import ModalInfo from "@/components/molecules/ModalInfo";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useModalActivateSim } from "@/context/modalactivatesim";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { resetModalUpdate } from "@/features/settings/settingsSlice";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";

const LoginHeaderImage = require("@/assets/images/login-header.png");
const LoginHeaderImageLight = require("@/assets/images/login-header-light.png");

const SignIn = () => {
  const { setCurrentIdSim, showModal, setTypeOfProcess } = useModalActivateSim();
  const { setProviders, isLoggedIn } = useAuth();
  const [provider, setProvider] = useState(null);
  const deviceUUID = useDeviceUUID();

  
  useFocusEffect(
    useCallback(() => {
      setTypeOfProcess("signin");
    }, [])
  );
  const { themeMode } = useDarkModeTheme();
  const [requestCodeModal, setRequestCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simType, setSimType] = useState(null);
  const { t } = useTranslation();
  const baseMsg = "pages.login";
  const loginQuery = useLogin();
  const auth = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    simNumber: Yup.string()
      .required(t("validators.required"))
      .test("len", t("validators.invalidSim"), (val) => val.length === 6 || val.length === 19),
  });
  

  const formik = useFormik({
    initialValues: {
      simNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setCurrentIdSim(values.simNumber);
      try {
        setIsLoading(true);
    
        if (!deviceUUID) {
          console.warn("⛔ UUID aún no disponible.");
          return;
        }
    
        const response = await loginQuery.loginRequest(
          values.simNumber,
          0,
          values.simNumber
        );
    
        if (response?.error) {
          console.warn("⚠️ Error durante loginRequest:", response.error);
          setRequestCodeModal(true);
          return;
        }
    
        const provider = response?.data?.provider;
    
        console.log("✅ Provider recibido desde loginRequest:", provider);
    
        if (!provider) {
          console.warn("⚠️ Provider no reconocido o ausente:", provider);
          setRequestCodeModal(true);
          return;
        }
    
        // Redirección segura según el provider
        if (provider === "telco-vision") {
          router.replace("/balance");
        } else if (provider === "tottoli") {
          router.replace("/home");
        } else {
          console.warn("⚠️ Provider no reconocido:", provider);
          setRequestCodeModal(true);
        }
      } catch (error) {
        console.error("🔥 Error general en onSubmit:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
  });
  
  
  
  useEffect(() => {
    const sim = formik.values.simNumber;
    setCurrentIdSim(sim);
    setSimType(determineType(sim));
  
    if (!deviceUUID) {
      console.warn("UUID no disponible para obtener el provider");
      setProvider(null);
      return;
    }
  
    const fetchProvider = async () => {
      try {
        if (sim.length === 6 || sim.length === 19) {
          console.log("📡 Consultando provider desde backend...");
          const data = await getSubscriberData(sim, deviceUUID);
          console.log("📬 Respuesta completa:", JSON.stringify(data, null, 2));
  
          if (data && typeof data === "object" && data.provider) {
            setProvider(data.provider);
          } else {
            console.warn("⚠️ El backend no devolvió un provider válido.");
            setProvider(null);
          }
        } else {
          setProvider(null);
        }
      } catch (error) {
        console.error("❌ Error al obtener el provider:", error);
        setProvider(null);
      }
    };
  
    fetchProvider();
  }, [formik.values.simNumber, deviceUUID]);

  const handleInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleInfoHowToWorkModal = () => {
    setModalHowToWorkVisible(!modalHowToWorkVisible);
  };
 

  const stateModal = useAppSelector((state) => state.modalReset.modalReset);

  return (
    <ScrollView>
      <HeaderEncrypted owner="encriptados" settingsLink="/settings-sign" />
      <View
        style={[
          themeMode === ThemeMode.Dark
            ? styles.container
            : { ...styles.container, backgroundColor: theme.lightMode.colors.cyanSuperLight },
        ]}
      >
        <View style={{ gap: 50 }}>
          <View style={styles.containerHeader}>
            <ImageBackground
              source={themeMode === ThemeMode.Dark ? LoginHeaderImage : LoginHeaderImageLight}
              resizeMode="cover"
              imageStyle={styles.background}
            >
              <View style={styles.containerHeaderImage}>
                <Text allowFontScaling={false} style={styles.containerHeaderTitle}>
                  {t(`${baseMsg}.header.title`)}
                </Text>
                <Text allowFontScaling={false} style={styles.containerHeaderMessage}>
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
                label={t(`${baseMsg}.fields.sim.label`)}
                onChangeText={formik.handleChange("simNumber")}
                handleBlur={formik.handleBlur("simNumber")}
                value={formik.values.simNumber}
                error={formik.touched.simNumber ? formik.errors.simNumber : null}
                required={true}
                placeholder={t(`${baseMsg}.fields.sim.placeholder`)}
                suffixIcon={
                  <IconSvg
                    color={themeMode === ThemeMode.Dark ? theme.colors.iconDefault : "#A1A1A1"}
                    height={25}
                    width={25}
                    type="info"
                  />
                }
                inputMode="numeric"
                maxLength={undefined}
                status={
                  simType
                    ? "success"
                    : formik.values.simNumber.length > 0
                    ? "info"
                    : null
                }                
                statusMessage={
                  !simType
                    ? t(`${baseMsg}.fields.sim.invalidSim`)
                    : t(`${baseMsg}.fields.sim.${simType}Sim`)
                }
                onPressIcon={handleInfoModal}
              />
            </View>
            <Button
              onClick={formik.handleSubmit}
              variant="primaryPress"
              disabled={!formik.isValid || !formik.values.simNumber}
            >
              <Text allowFontScaling={false} style={styles.loadingButton}>
                {formik.values.simNumber.length === 19 ? "Activar SIM" : "Solicitar código"}
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
        {/* {requestCodeModal && (
          <VerificationSim
            showModal={requestCodeModal}
            resetModal={() => setRequestCodeModal(false)}
            isLoading={isLoading}
            onVerified={() => {
              router.push("/home/");
            }}
        />
        )} */}

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
