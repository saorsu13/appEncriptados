// React y librerías externas
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { router, useFocusEffect } from "expo-router";

// React Native
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  Pressable,
} from "react-native";

// Theming y estilos
import theme from "@/config/theme";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

// Contextos y hooks de negocio
import { useAuth } from "@/context/auth";
import { useLogin } from "@/features/sign-in/useLogin";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { useModalActivateSim } from "@/context/modalactivatesim";

// Utilidades
import { determineType } from "@/utils/utils";
import { getDeviceUUID } from "@/utils/getUUID";

// APIs
import { createSubscriber } from "@/api/subscriberApi";

// Redux slices
import { addSim } from "@/features/sims/simSlice";

// Componentes
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import InputField from "@/components/molecules/InputField/InputFIeld";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import Button from "@/components/atoms/Button/Button";
import StepList from "@/components/molecules/StepList/StepList";
import VerificationSim from "@/components/organisms/VerificationSim/VerificationSim";
import ModalInfo from "@/components/molecules/ModalInfo";
import Alert from "@/components/molecules/Alert";
import AlertButton from "@/components/molecules/AlertButton/AlertButton";
import SuccessModal from "@/components/molecules/SuccessModal/SuccessModal";
import InsertSimCardModal from "@/components/molecules/InsertSimCardModal/InsertSimCardModal";

const Login = () => {
  // Constantes
const LoginHeaderImage = require("@/assets/images/new-sim-hero.png");
const baseMsg = "pages.login";

// Contextos y dispatch
const { setTypeOfProcess, showModal, setCurrentIdSim, typeOfProcess } = useModalActivateSim();
const { isModalVisible } = useModalPassword();
const dispatch = useDispatch();
const auth = useAuth();
const loginQuery = useLogin();
const { t } = useTranslation();
const { themeMode } = useDarkModeTheme();
const { colors } = useTheme<ThemeCustom>();

// Estados locales
const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
const [requestCodeModal, setRequestCodeModal] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);

const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState("");
const [showAlertButton, setShowAlertButton] = useState(false);

const [isLoading, setIsLoading] = useState(false);
const [type, setType] = useState<any>(false);

// Validación con Yup
const validationSchema = Yup.object().shape({
  simNumber: Yup.string()
    .required(t("validators.required"))
    .test("len", t("validators.invalidSim"), (val) => 
      val.length === 6 || val.length === 19
  ),
});

// Formik
const formik = useFormik({
  initialValues: { simNumber: "" },
  validationSchema,
  onSubmit: handleSubmit,
});

useFocusEffect(
  useCallback(() => {
    setTypeOfProcess("newsim");
    formik.resetForm();
  }, [])
);

useEffect(() => {
  const fetchPersistedState = async () => {
    try {
      const persisted = await AsyncStorage.getItem("root");
      if (persisted) JSON.parse(persisted);
    } catch (err) {
      console.error("Error al obtener el estado persistido:", err);
    }
  };
  fetchPersistedState();
}, []);

useEffect(() => {
  const sim = formik.values.simNumber;
  const resolvedType = determineType(sim);
  console.log("🔍 [new-sim] SIM cambiada:", sim, "| Tipo detectado:", resolvedType);
  setCurrentIdSim(sim);
  setType(resolvedType);
}, [formik.values.simNumber]);

useEffect(() => {
  setShowAlertButton(!!alertMessage);
}, [alertMessage]);

function handleSubmit(values) {
  if (Object.keys(formik.errors).length) {
    setRequestCodeModal(false);
    return;
  }
  setRequestCodeModal(true);
}

async function handleRequestCode() {
  if (!type) return;
  console.log("⚠️ [new-sim] Tipo de SIM no definido, saliendo...");

  try {
    const isSim19Digits = formik.values.simNumber.length === 19;
    console.log("🔢 [new-sim] SIM:", formik.values.simNumber, "| Tipo:", isSim19Digits ? "telco-vision" : "tottoli");

    const subscriberData = {
      iccid: formik.values.simNumber,
      provider: isSim19Digits ? "telco-vision" : "tottoli",
      name: isSim19Digits ? "Sim" : "Sim",
      uuid: await getDeviceUUID(),
    };
    console.log("📦 [new-sim] Datos a enviar:", subscriberData);

    const result = await createSubscriber(subscriberData);
    console.log("✅ [new-sim] Resultado API:", result);

    if (result.code === "duplicate_iccid" || result.id) {
      console.log("🎉 [new-sim] SIM creada o duplicada, mostrando modal de éxito");

      showModal?.(); 
      setModalSuccessVisible(true); 
      dispatch(addSim({ idSim: formik.values.simNumber, simName: "SIM" }));
      router.replace({
        pathname: "/home",
        params: {
          simId: formik.values.simNumber, 
          refetchSims: "true"
        },
      });
    } else {
      throw new Error("Failed to create");
    }
  } catch (err) {
    console.error("[new-sim] Error al crear la SIM:", err);
    showModal?.(); 
  }
}

async function validateCode(code) {
  setIsLoading(true);
  setAlertMessage("");
  setAlertType("");
  setShowAlertButton(false);

  let message = "";
  try {
    const { error } = await loginQuery.loginRequest(
      formik.values.simNumber,
      code,
      "SIM"
    );
    if (error) {
      message = "SIM o Código no válido. Vuelve a intentarlo";
      setAlertType("error");
    } else {
      message = "SIM activada. Undir aquí para acceder a la configuración.";
      setAlertType("success");
      formik.resetForm();
    }
  } catch {
    message = "Ocurrió un error al realizar la petición";
    setAlertType("error");
  }

  setAlertMessage(message);
  setIsLoading(false);
  setRequestCodeModal(false);
  setShowAlertButton(true);
  return message;
}

// Helpers de UI
const handleInfoModal = () => setModalVisible((v) => !v);
const handleInfoHowToWorkModal = () => setModalHowToWorkVisible((v) => !v);


  return (
    <ScrollView>
      {/* Header */}
      <HeaderEncrypted
        title={t(`pages.newSim.pageTitle`)}
        iconBack="/home"
      />

      {/* Contenedor principal */}
      <View
        style={[
          styles.container,
          { backgroundColor: themeMode === "dark" ? "#000" : theme.lightMode.colors.white },
        ]}
      >
        {/* Sección Hero */}
        <View style={styles.containerHeader}>
          <ImageBackground
            source={LoginHeaderImage}
            resizeMode="cover"
            imageStyle={styles.background}
          >
            <View style={styles.containerHeaderImage}>
              <Text allowFontScaling={false} style={styles.containerHeaderTitle}>
                {t(`pages.newSim.title`)}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Formulario de SIM */}
        <View style={styles.containerForm}>
          {/* Título y enlace de ayuda */}
          <View style={styles.containerTitleForm}>
            <Text
              allowFontScaling={false}
              style={[
                styles.titleForm,
                { color: themeMode === "dark" ? theme.colors.textContrast : "#454545" },
              ]}
            >
              {t(`${baseMsg}.form.title`)}
            </Text>
            <Pressable onPress={handleInfoHowToWorkModal}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleLink,
                  { color: themeMode === "dark" ? theme.colors.textContrast : "#454545" },
                ]}
              >
                {t(`${baseMsg}.form.link`)}
              </Text>
            </Pressable>
          </View>

          {/* Campo de entrada */}
          <View style={styles.containerFormFields}>
            <InputField
              label={t(`${baseMsg}.fields.sim.label`)}
              placeholder={t(`${baseMsg}.fields.sim.placeholder`)}
              onChangeText={formik.handleChange("simNumber")}
              handleBlur={formik.handleBlur("simNumber")}
              value={formik.values.simNumber}
              error={formik.touched.simNumber ? formik.errors.simNumber : null}
              required
              inputMode="numeric"
              maxLength={19}
              suffixIcon={
                <IconSvg width={25} height={25} type="info" color={theme.colors.contrast} />
              }
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

          {/* Alerta con botón */}
          {showAlertButton && (
            <AlertButton
              message={alertMessage}
              type={alertType as any}
              onPress={() => {
                if (alertType === "success") {
                  setAlertMessage("");
                  router.replace("/home");
                }
              }}
            />
          )}

          {/* Botón de solicitud de código */}
          <Button
            onClick={handleRequestCode}
            variant="primaryPress"
            disabled={!type}
          >
            <Text allowFontScaling={false} style={styles.loadingButton}>
              {t(`${baseMsg}.actions.requestCode`)}
            </Text>
          </Button>

          {/* Pasos informativos */}
          <StepList
            title={t(`${baseMsg}.form.stepsList.title`)}
            items={[
              t(`${baseMsg}.form.stepsList.step1`),
              t(`${baseMsg}.form.stepsList.step2`),
              t(`${baseMsg}.form.stepsList.step3`),
            ]}
          />

          {/* Mensaje de advertencia */}
          <Alert
            description={t("pages.home.useFive")}
            message=""
            showIcon
            type="warning"
          />
        </View>
      </View>

      {/* Modales */}
      <ModalInfo
        visible={modalHowToWorkVisible}
        onClose={handleInfoHowToWorkModal}
        title={t(`${baseMsg}.helpMessages.howToWorkHelpTittle`)}
        description={t(`${baseMsg}.helpMessages.howToWorkHelpMessage`)}
        buttonText={t(`${baseMsg}.helpMessages.closeBtnText`)}
      />

      {/* 
      <VerificationSim
        showModal={requestCodeModal}
        validateCode={validateCode}
        resetModal={() => setRequestCodeModal(false)}
        isLoading={isLoading}
        addNewSimDisabled
      /> 
      */}
    </ScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  // Layout general
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 50,
  },

  // Header / Hero
  containerHeader: {
    gap: 20,
  },
  background: {
    aspectRatio: 2.196,
    borderRadius: 18,
    height: 158,
    width: "100%",
  },
  containerHeaderImage: {
    aspectRatio: 2.196,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 158,
  },
  containerHeaderTitle: {
    textAlign: "center",
    fontFamily: theme.textVariants.input,
    ...theme.textVariants.buttonGroup,
  },

  // Formulario
  containerForm: {
    flexDirection: "column",
    gap: 20,
  },
  containerTitleForm: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleForm: {
    ...theme.textVariants.modalSummary,
  },
  titleLink: {
    borderBottomWidth: 0.3,
  },
  containerFormFields: {
    flexDirection: "column",
    gap: 10,
  },
  loadingButton: {
    flexDirection: "row",
    gap: 5,
  },
});

export const unstable_settings = {
  unmountOnBlur: true,
};
