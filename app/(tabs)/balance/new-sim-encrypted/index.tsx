import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createSubscriber } from "@/api/subscriberApi";
import * as Yup from "yup";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFormik } from "formik";
import InputField from "@/components/molecules/InputField/InputFIeld";
import SuccessModal from "@/components/molecules/SuccessModal/SuccessModa";
import Button from "@/components/atoms/Button/Button";
import theme from "@/config/theme";
import { determineType } from "@/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { useModalPassword } from "@/context/modalpasswordprovider";
import AlertButton from "@/components/molecules/AlertButton/AlertButton";
import { router, useFocusEffect } from "expo-router";
import { useModalActivateSim } from "@/context/modalactivatesim";
import { updateCurrentSim } from "@/features/sims/simSlice";
import { useDispatch } from "react-redux";
import { listSubscriber } from "@/api/subscriberApi";
import { setSims } from "@/features/sims/simSlice";


const LoginHeaderImage = require("@/assets/images/new-sim-hero.png");

const Login = () => {
  const { setTypeOfProcess, showModal, setCurrentIdSim, typeOfProcess } =
    useModalActivateSim();
  const { isModalVisible } = useModalPassword();
  const deviceUUID = useDeviceUUID();

  useFocusEffect(
    useCallback(() => {
      console.log("📲 [new-sim-tim] Entrando a la vista new-sim-tim");
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const { themeMode } = useDarkModeTheme();

  const [newSimProvider, setNewSimProvider] = useState<string | null>(null);

  const dispatch = useDispatch();
  const [createdSim, setCreatedSim] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    simNumber: Yup.string()
      .required(t("validators.required"))
      .matches(/^(\d{6}|\d{19})$/, t("validators.invalidSim")),
  });

  const handleSubmit = async (values) => {
    console.log("📝 [new-sim-tim] Enviando formulario con SIM:", values.simNumber);
    if (Object.keys(formik.errors).length > 0) return;
    if (!deviceUUID) {
      console.warn("⚠️ [new-sim-tim] UUID no disponible");
      return;
    }
    try {
      setIsLoading(true);
      const subscriberData =
        values.simNumber.length === 6
          ? {
            iccid: values.simNumber,
            provider: "tottoli",
            name: "Sim",
            uuid: deviceUUID,
          }
          : {
            iccid: values.simNumber,
            provider: "telco-vision",
            name: "Sim",
            uuid: deviceUUID,
          };

      console.log("🆕 [new-sim-tim] Creando SIM con provider:", subscriberData.provider);
      const result = await createSubscriber(subscriberData);
      setCreatedSim(result);
      setNewSimProvider(subscriberData.provider);
      console.log("📦 [new-sim-tim] SIM creada correctamente:", result);
      await AsyncStorage.setItem("currentICCID", values.simNumber);
      setModalSuccessVisible(true);
    } catch (error) {
      console.error("❌ [new-sim-tim] Error al crear SIM:", error);
      setAlertMessage("Error al agregar la SIM");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = async () => {
    setModalSuccessVisible(false);

    const iccid = formik.values.simNumber;
    const sim = {
      code: createdSim?.id ?? "", 
      idSim: iccid,
      provider: newSimProvider,
      simName: "Sim",
      iccid,
    };

    await AsyncStorage.setItem("currentICCID", iccid);
    console.log("✅ [new-sim-tim] Modal de éxito cerrado. Provider:", newSimProvider);

    try {
      const uuid = deviceUUID;
      if (!uuid) {
        console.warn("❌ UUID no disponible al cerrar modal de éxito");
        return;
      }
  
      const freshSims = await listSubscriber(uuid);
      const normalized = freshSims.map((s: any) => ({
        ...s,
        idSim: s.idSim || s.iccid,
        simName: s.simName || s.name || "Sim",
      }));
  
      dispatch(setSims(normalized));
      dispatch(updateCurrentSim(iccid));
    } catch (e) {
      console.error("❌ Error al actualizar SIMs luego de creación:", e);
    }
  
    console.log("✅ [new-sim-tim] Modal de éxito cerrado. Provider:", newSimProvider);
  

    if (newSimProvider === "tottoli") {
      console.log("➡️ [new-sim-tim] Redirigiendo a /home");
      router.replace("/home");
    } else {
      console.log("➡️ [new-sim-tim] Redirigiendo a /balance");
      router.replace("/balance");
    }
  };

  useEffect(() => {
    const fetchPersistedState = async () => {
      try {
        const persistedState = await AsyncStorage.getItem("root");
        if (persistedState !== null) {
          console.log("📦 [new-sim-tim] Estado persistido recuperado");
        }
      } catch (error) {
        console.error("❌ [new-sim-tim] Error obteniendo estado persistido:", error);
      }
    };

    fetchPersistedState();
  }, []);

  const formik = useFormik({
    initialValues: { simNumber: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    console.log("🔢 [new-sim-tim] SIM actual ingresada:", formik.values.simNumber);
    setCurrentIdSim(formik.values.simNumber);
  }, [formik.values.simNumber]);

  useEffect(() => {
    const detectedType = determineType(formik.values.simNumber);
    setType(detectedType);
    console.log("🧠 [new-sim-tim] Tipo de SIM detectado:", detectedType);
  }, [formik.values.simNumber]);

  useEffect(() => {
    console.log("⚠️ [new-sim-tim] Mensaje de alerta:", alertMessage);
    setShowAlertButton(!!alertMessage);
  }, [alertMessage]);

  const handleInfoModal = () => {
    console.log("ℹ️ [new-sim-tim] Abriendo modal informativo");
    setModalVisible(!modalVisible);
  };

  const { colors } = useTheme<ThemeCustom>();

  useFocusEffect(
    useCallback(() => {
      console.log("♻️ [new-sim-tim] Reset de formulario");
      formik.resetForm();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <HeaderEncrypted owner="encriptados" iconBack="/balance" />
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
            <View style={styles.containerTitleForm}></View>
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
                maxLength={19}
                status={
                  type
                    ? "success"
                    : formik.values.simNumber.length === 19
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

            <Text style={{ marginTop: 10, alignSelf: "center", color: "#9A9A9A" }}>
              {t("pages.home.useFive")}
            </Text>

            {showAlertButton && (
              <AlertButton
                onPress={() => {
                  if (alertType === "success") {
                    setAlertMessage("");
                    router.replace("/balance");
                  }
                }}
                message={alertMessage}
                type={alertType as any}
              />
            )}

            <View style={styles.bottomButtonContainer}>

              <Button
                onClick={formik.handleSubmit}
                variant="primaryPress"
                disabled={!formik.isValid || !formik.values.simNumber}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t(`${baseMsg}.actions.active`)}
                  </Text>
                )}
              </Button>

            </View>
          </View>
        </View>
        <SuccessModal
          visible={modalSuccessVisible}
          simNumber={formik.values.simNumber}
          onClose={handleSuccessModalClose}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
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
    aspectRatio: 2.1919,
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
    aspectRatio: 2.1919,
    borderRadius: 18,
    height: 158,
    width: "100%",
  },
  bottomButtonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});