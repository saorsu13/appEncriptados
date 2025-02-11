import React, { useEffect, useState } from "react";
import VerificationModal from "@/components/molecules/VerificationModal/VerificationModal";

import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Button from "@/components/atoms/Button/Button";
import VerificationInput from "@/components/molecules/VerificationDigit/VerificationDigit";
import { router } from "expo-router";
import theme from "@/config/theme";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useAppSelector } from "@/hooks/hooksStoreRedux";

const VerificationSim = ({
  showModal = false,
  validateCode,
  resetModal,
  isLoading = false,
  addNewSimDisabled = false,
}) => {
  const { t } = useTranslation();
  const [successModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [requestCode, setRequestCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const verificationMessages = "pages.login.verification";

  const handleCode = (code: string) => {
    setVerificationCode(code);
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
  };

  const closeFailedModal = () => {
    resetModal();
    setFailedModal(false);
  };

  const closeRequestCode = () => {
    setRequestCode(false);
    resetModal();
  };

  const handleValidateCode = async () => {
    if (!verificationCode) return;

    const isValid = await validateCode(verificationCode);
    if (isValid) {
      setRequestCode(false);
      setSuccessModal(true);
    } else {
      setRequestCode(false);
      setFailedModal(true);
    }
  };

  const goHome = () => {
    closeSuccessModal();
    router.replace("/home/");
  };

  const addNewSim = () => {
    router.push("/sign-in/");
  };

  useEffect(() => {
    setRequestCode(showModal);
  }, [showModal]);

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  return (
    <>
      <VerificationModal
        icon={<IconSvg height={50} width={50} type="verificationsuccess" />}
        title={t(`${verificationMessages}.success.title`)}
        message={t(`${verificationMessages}.success.message`, {
          value: "091849501949",
        })}
        modalVisible={successModal}
        closeModal={closeSuccessModal}
      >
        <>
          <Button onClick={goHome}>{t("pages.login.actions.mySims")}</Button>
          {!addNewSimDisabled && (
            <Button onClick={addNewSim} variant={"secondary"}>
              {t("pages.login.actions.addSim")}
            </Button>
          )}
        </>
      </VerificationModal>

      {failedModal && (
        <VerificationModal
          icon={
            <IconSvg height={50} width={50} type="verificationiconfailed" />
          }
          title={t(`${verificationMessages}.failed.title`)}
          message={t(`${verificationMessages}.failed.message`)}
          modalVisible={failedModal}
          closeModal={closeFailedModal}
        >
          <Button onClick={closeFailedModal} variant={"secondary"}>
            {t("pages.login.actions.retry")}
          </Button>
        </VerificationModal>
      )}

      {requestCode && (
        <VerificationModal
          icon={<IconSvg type="accountcode" height={50} width={50} />}
          title={t(`pages.login.requestCode.title`)}
          message={t(`pages.login.requestCode.message`)}
          modalVisible={requestCode}
          closeModal={closeRequestCode}
          closeBtn={true}
        >
          <View style={styles.containerAction}>
            <VerificationInput handleCode={handleCode} />
            <Button
              onClick={handleValidateCode}
              customStyles={styles.loadingButton}
            >
              {t("pages.login.actions.verify")}
              {isLoading && !modalRequiredPassword ? (
                <ActivityIndicator size="small" color={theme.colors.contrast} />
              ) : null}
            </Button>
          </View>
        </VerificationModal>
      )}
    </>
  );
};

export default VerificationSim;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
  },
  containerAction: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
