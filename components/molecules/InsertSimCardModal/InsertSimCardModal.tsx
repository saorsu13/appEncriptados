import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "@/components/atoms/Button/Button";
import theme from "@/config/theme";
import VerificationInputSim from "./VerificationInputSim";
import { useModalActivateSim } from "@/context/modalactivatesim";
import IconSvg from "../IconSvg/IconSvg";
import { login } from "@/features/sign-in/useLogin";
import { useMutation } from "@tanstack/react-query";
import useModalAll from "@/hooks/useModalAll";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { useModalAdminSims } from "@/context/modaladminsims";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { addSim } from "@/features/sims/simSlice";
import { useAuth } from "@/context/auth";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { createSubscriber } from "@/api/subscriberApi";
import { getDeviceUUID } from "../../../utils/getUUID";


export interface LoginResponse {
  status: string;
}

export interface LoginParams {
  id: number;
  code: number;
}

const InsertSimCardModal: React.FC = () => {
  const ERRORS_TYPES = {
    INCORRECT_CODE: "fail",
  };

  const { showModal } = useModalAll();
  const { signIn } = useAuth();
  const { colors } = useTheme<ThemeCustom>();
  const { t } = useTranslation();
  const {
    isModalVisible,
    hideModal,
    currentSimCode,
    currentIdSim,
    typeOfProcess,
  } = useModalActivateSim();

  const dispatch = useDispatch();

  const { openModal } = useModalAdminSims();

  const mutation = useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: login,
    onSuccess: async (data) => {
      const handleError = () => {
        hideModal();
        showModal({
          type: "error",
          oneButton: true,
          title: t("type.error"),
          description: t("modalSimActivate.errors.failed"),
          textConfirm: t("actions.right"),
          buttonColorConfirm: colors.danger,
        });
      };

      const handleSuccess = (onConfirm: () => void) => {
        showModal({
          type: "confirm",
          buttonColorConfirm: colors.primaryColor,
          oneButton: true,
          buttonColorCancel: colors.danger,
          textConfirm: t("modalSimActivate.goToPanel"),
          description: t("modalSimActivate.successfully.ok"),
          title: t("modalSimActivate.successfully.oktitle"),
          onConfirm: onConfirm,
        });
      };

      if (data.status === ERRORS_TYPES.INCORRECT_CODE) {
        if (typeOfProcess === "signin" || typeOfProcess === "newsim") {
          handleError();
        }
      } else {
        if (typeOfProcess === "signin") {
          handleSuccess(() => {
            signIn({
              idSim: currentIdSim,
              code: currentSimCode,
              simName: "SIM",
            });
          });
        } else if (typeOfProcess === "newsim") {
          try {
            const subscriberData = {
              iccid: currentIdSim.toString(),
              provider: "telco-vision", 
              name: "Sim Tim",            
              uuid: await getDeviceUUID(),  
            };
            const result = await createSubscriber(subscriberData);
  
            if (result.code === "duplicate_iccid" || result.id) {
              handleSuccess(() => {
                openModal();
                dispatch(addSim({ idSim: currentIdSim, simName: "SIM" }));
                router.push("/home");
              });
            } else {
              // Falló creación
              showModal({
                type: "error",
                oneButton: true,
                title: t("type.error"),
                description: t("modalSimActivate.errors.failedCreateSim"),
                textConfirm: t("actions.right"),
                buttonColorConfirm: colors.danger,
              });
            }
          } catch (err) {
            console.error("Error al crear subscriber:", err);
            showModal({
              type: "error",
              oneButton: true,
              title: t("type.error"),
              description: t("modalSimActivate.errors.failedCreateSim"),
              textConfirm: t("actions.right"),
              buttonColorConfirm: colors.danger,
            });
          }
        }
      }

      hideModal();
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const checkCodeIsValid = () => {
    mutation.mutate({
      id: currentIdSim,
      code: currentSimCode,
    });
  };

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  return (
    <Modal
      visible={isModalVisible && typeOfProcess === "signin"}
      transparent={true}
      animationType="fade"
      onRequestClose={hideModal}
    >
      <TouchableWithoutFeedback onPress={hideModal}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <IconSvg type="accountcode" height={50} width={50} />

              <View style={styles.containerHeader}>
                <View style={styles.containerHeaderContent}>
                  <Text
                    allowFontScaling={false}
                    style={[styles.title, styles.titleInfo]}
                  >
                    {t(`pages.login.requestCode.title`)}
                  </Text>
                </View>
              </View>
              <Text
                allowFontScaling={false}
                style={[styles.message, styles.messageInfo]}
              >
                {t(`pages.login.requestCode.message`)}
              </Text>
              <VerificationInputSim />

              <Button
                onClick={() => {
                  if (currentSimCode.toString().length < 4) {
                    return;
                  }
                  checkCodeIsValid();
                }}
                customStyles={styles.loadingButton}
              >
                {t("pages.login.actions.verify")}
              </Button>

              {mutation.isPending && !modalRequiredPassword ? (
                <ActivityIndicator size="small" color={colors.primaryColor} />
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InsertSimCardModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    rowGap: 15,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    justifyContent: "center",
    minHeight: 200,
  },
  loadingButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  titleInfo: {
    color: theme.colors.mainAction,
    textAlign: "center",
  },
  messageInfo: {
    textAlign: "center",
    paddingHorizontal: 0,
  },
  message: {
    textAlign: "center",
    color: theme.colors.contentSummary,
    paddingHorizontal: 10,
    ...theme.textVariants.contentSummary,
  },
  title: {
    textAlign: "center",
    color: theme.colors.primarySummary,
    ...theme.textVariants.modalSummary,
  },
  containerHeaderContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D9D9D9",
  },
  containerHeader: {
    gap: 15,
  },
});
