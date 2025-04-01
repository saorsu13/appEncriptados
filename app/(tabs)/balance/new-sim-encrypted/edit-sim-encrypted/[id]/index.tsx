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
import useModalAll from "@/hooks/useModalAll";
import { useModalAdminSims } from "@/context/modaladminsims";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateSimName } from "@/features/sims/simSlice";

const LoginHeaderImage = require("@/assets/images/new-sim-hero-edit.png");
type RootStackParamList = {
  MyRoute: { id: string }; // O el tipo adecuado para tu ID
};

// Define el tipo de la ruta usando RouteProp
type MyRouteProp = RouteProp<RootStackParamList, "MyRoute">;
const Login = () => {
  const { isModalVisible } = useModalPassword();

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

  const { params } = useRoute<MyRouteProp>();

  const { showModal } = useModalAll();

  const { openModal } = useModalAdminSims();

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    simName: Yup.string()
      .required(t("validators.required"))
      .max(9, t("validators.invalidSim")),
  });

  const handleSubmit = (values) => {
    showModal({
      type: "confirm",
      buttonColorConfirm: colors.primaryColor,
      oneButton: true,
      buttonColorCancel: colors.danger,
      textConfirm: t("modalSimActivate.goToPanel"),
      title: t("modalSimActivate.changeNameSimTitle"),
      onConfirm: () => {
        openModal();
        router.push("/balance");
        formik.resetForm();
      },
    });
    dispatch(
      updateSimName({ idSim: params.id, newName: formik.values.simName })
    );
  };

  const formik = useFormik({
    initialValues: {
      simName: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const { colors } = useTheme<ThemeCustom>();

  useFocusEffect(
    useCallback(() => {
      formik.resetForm();
    }, [])
  );

  return (
    <ScrollView>
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
            <View style={{ ...styles.containerHeaderImage }}>
              <Text
                allowFontScaling={false}
                style={styles.containerHeaderTitle}
              >
                {t("pages.login.header.changeNameSimBanner")}
              </Text>
              {/* <Text
                allowFontScaling={false}
                style={styles.containerHeaderTitle}
              >
                {params.id}
              </Text> */}
            </View>
          </ImageBackground>
        </View>

        <View style={styles.containerForm}>
          <View style={styles.containerFormFields}>
            <InputField
              label={t(`pages.login.header.newNameOfYourSim`)}
              onChangeText={formik.handleChange("simName")}
              value={formik.values.simName}
              required={true}
              placeholder={t(`pages.login.header.placeholderSim`)}
              inputMode="text"
              maxLength={9}
              status={
                type
                  ? "success"
                  : formik.values.simName.length === 9
                  ? "info"
                  : null
              }
              statusMessage={
                !type
                  ? t(`pages.login.header.numberOfCharacters`)
                  : t(`${baseMsg}.fields.sim.${type}Sim`)
              }
              suffixIcon={
                formik.values.simName.length ? (
                  <IconSvg width={20} height={20} type="confirmgreen" />
                ) : null
              }
            />
          </View>

          <Button
            disabled={!formik.values.simName.length ? true : false}
            onClick={formik.handleSubmit}
            variant="primaryPress"
          >
            <Text allowFontScaling={false} style={styles.loadingButton}>
              {t("pages.home.confirm")}
            </Text>
          </Button>
        </View>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Text allowFontScaling={false} style={{ ...styles.defaultLabel }}>
          {t(`pages.login.header.nameOfSimMax`)}
        </Text>
      </View>
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
  required: {
    color: theme.colors.mainActionState,
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
  defaultLabel: {
    color: theme.colors.labelText,
    paddingLeft: 3,
    ...theme.textVariants.descriptionCard,
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
    justifyContent: "center",
    ...theme.textVariants.buttonGroup,
  },
  background: {
    borderRadius: 18,
    height: 158,
    width: "100%",
  },
});
