import CardIcon from "@/components/molecules/CardIcon/CardIcon";
import VerificationModal from "@/components/molecules/VerificationModal/VerificationModal";

import React, { useEffect, useState } from "react";

import Button from "@/components/atoms/Button/Button";
import { useTranslation } from "react-i18next";
import { useChangeImsi } from "@/features/imsi/useChangeImsi";
import { useSelector } from "react-redux";
import theme from "@/config/theme";
import { StyleSheet } from "react-native";
import { useAppDispatch } from "@/hooks/hooksStoreRedux";
import { setLoading } from "@/features/loading/loadingSlice";
import useModalAll from "@/hooks/useModalAll";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

const ChangeImsi = ({ showChangeImsi, handleClose }) => {
  const { themeMode } = useDarkModeTheme();
  const handleOnCompleted = () => {
    showModal({
      type: "confirm",
      oneButton: true,
      title: t("modalIMSI.successful"),
      description: t("modalIMSI.resetMobileIMSI"),
      textConfirm: t("actions.right"),
      buttonColorConfirm: "#10B4E7",
    });
  };
  const handleError = () => {
    showModal({
      type: "error",
      oneButton: true,
      title: t("type.error"),
      description: t("modalIMSI.error"),
      textConfirm: t("actions.right"),
      buttonColorConfirm: "#CB0808",
    });
    dispatch(setLoading(false));
  };

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentSim = useSelector((state: any) => state.sims.currentSim);
  const [isSuccesfullChange, setIsSuccesfullChange] = useState(false);
  const [hasError, setHasError] = useState(false);
  const baseMsg = "pages.changeImsi";

  const query = useChangeImsi(
    currentSim?.idSim,
    "on",
    handleError,
    handleOnCompleted
  );

  const { showModal } = useModalAll();

  const handleChange = () => {
    query
      .refetch()
      .then((res) => {
        const result = !query.isError
          ? res.data?.status == 200
          : !query.isError;

        if (result) {
          setIsSuccesfullChange(result);
        } else {
          setIsSuccesfullChange(null);
        }
      })
      .catch((err) => {});
  };

  const handleCloseResult = () => {
    setIsSuccesfullChange(false);
    handleClose(false);
  };

  return (
    <>
      <VerificationModal
        modalVisible={showChangeImsi}
        icon={
          <CardIcon mode="dark">
            <IconSvg
              color={theme.colors.iconDefault}
              height={50}
              width={50}
              type="voicechange"
            />
          </CardIcon>
        }
        title={t(`${baseMsg}.title`)}
        message={t(`${baseMsg}.description`)}
        closeModal={() => handleClose(false)}
        mode={themeMode === ThemeMode.Dark ? "dark" : "light"}
      >
        <Button
          onClick={async () => {
            handleClose(false);
            await handleChange();
            handleClose(false);
          }}
          variant={"primaryPress"}
        >
          {t("actions.changeNow")}
        </Button>
        <Button
          onClick={() => handleClose(false)}
          customStyles={[styles.buttonPrimary]}
          variant="delete"
        >
          {t("pages.deleteSimModal.cancel")}
        </Button>
      </VerificationModal>
    </>
  );
};

export default ChangeImsi;

const styles = StyleSheet.create({
  buttonPrimary: {
    fontFamily: theme.textVariants.button.fontFamily,
  },
});
