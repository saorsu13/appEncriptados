import ButtonGroup from "@/components/molecules/ButtonGroup/ButtonGroup";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import {
  buttonGroupDataPsysical,
  buttonSg,
  buttonsR1R2,
  SIM_TYPES,
} from "@/app/mock";
import { useTranslation } from "react-i18next";
import Label from "@/components/atoms/Label/Label";

import theme from "@/config/theme";
import { changeNetworkProfile } from "@/features/network-profile/useNetworkProfile";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentNetwork } from "@/features/network-profile/networkProfileSlice";
import ModalInfo from "@/components/molecules/ModalInfo";
import Loader from "@/components/molecules/Loader";
import useModalAll from "@/hooks/useModalAll";
import { useCountdown } from "@/context/countdown";
import ProgressBar from "@/components/atoms/ProgressBar";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { determineTypeSim } from "@/utils/validation";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonGrid from "@/components/molecules/SkeletonContent/SkeletonGrid";
import SkeletonContent from "@/components/molecules/SkeletonContent";

const WAIT_TIME = 60;

const NetworkProfile = () => {
  const { t } = useTranslation();
  const baseMsg = "pages.home";
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const currentNetwork = useSelector(
    (state: any) => state.networkProfile.networkProfile
  );

  const dispatch = useDispatch();
  const [selectedButton, setSelectedButton] = useState(currentNetwork || "r1");
  const [disabled, setIsDisabled] = useState(false);

  const [prevSelectedButton, setPrevSelectedButton] = useState(
    currentNetwork || "r1"
  );

  const recommendedValue = useSelector(
    (state: any) => state.networkProfile.recommendedNetwork
  );

  const simType = useAppSelector((state) =>
    determineTypeSim(state.sims.currentSim.idSim)
  );

  const mutation = useMutation({
    mutationFn: () => changeNetworkProfile(currentSim.idSim, selectedButton),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { count, startCountdown, isActive: isDisabled } = useCountdown();

  const { showModal } = useModalAll();

  const { themeMode } = useDarkModeTheme();

  useEffect(() => {
    setSelectedButton(currentNetwork);
    dispatch(updateCurrentNetwork(currentNetwork));
  }, [currentNetwork]);

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  const handleProfile = (value: any) => {
    if (value !== selectedButton) {
      setPrevSelectedButton(selectedButton);
      setSelectedButton(value);

      if (!modalRequiredPassword) {
        setLoading(true);
      }
      mutation.mutate();

      if (!isDisabled) startCountdown(WAIT_TIME);
    }
  };

  const handleInfoModal = () => {
    setModalVisible(!modalVisible);
  };

  function handleError() {
    showModal({
      type: "error",
      oneButton: true,
      title: t("type.error"),
      description: t("modalProfile.error"),
      textConfirm: "Entendido",
      buttonColorConfirm: "#CB0808",
    });

    setSelectedButton(prevSelectedButton);
    setLoading(false);
    showAlert();
  }

  function showAlert() {
    Alert.alert(t("defaultErrorMessage"));
  }

  function getSimProfiles(simType: string | boolean, currentNetwork: string) {
    switch (simType) {
      case SIM_TYPES.ELECTRONIC:
        if (currentNetwork === "r1" || currentNetwork === "r2") {
          return buttonsR1R2;
        } else if (currentNetwork === "sg") {
          return buttonSg;
        }
        break;

      case SIM_TYPES.PHYSICAL:
        return buttonGroupDataPsysical; 
      default:
        return [];
              
    }
  }

  return (
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
      <View style={styles.networkHeader}>
        <Label
          fixWidth
          customStyles={
            themeMode === ThemeMode.Dark
              ? null
              : { color: theme.lightMode.colors.blueDark }
          }
          label={t(`${baseMsg}.networkProfile`)}
          variant="strong"
        />
        <TouchableOpacity onPress={handleInfoModal}>
          <IconSvg
            color={
              themeMode === ThemeMode.Dark
                ? theme.lightMode.colors.graySoft
                : theme.lightMode.colors.blueDark
            }
            height={50}
            type="info"
          />
        </TouchableOpacity>
      </View>
      <ButtonGroup
        options={getSimProfiles(simType, currentNetwork)}
        recomendedValue={recommendedValue}
        defaultValue={selectedButton}
        suggestText={t("helpMessages.recommended")}
        handleValue={handleProfile}
        value={selectedButton}
        style={
          {
            // width: "100%",
            // display: "flex",
            // flexWrap: "nowrap",
            // flexDirection: "row",
          }
        }
        disabled={isDisabled}
      />
      {isDisabled && (
        <View>
          <Text
            allowFontScaling={false}
            style={
              themeMode === ThemeMode.Dark
                ? styles.countDownTimer
                : {
                    ...styles.countDownTimer,
                    color: theme.lightMode.colors.blueDark,
                  }
            }
          >
            {t(`${baseMsg}.timeLeft`)} {count} {t(`${baseMsg}.timeUnit`)}
          </Text>
          <ProgressBar precentage={(count / WAIT_TIME) * 100} />
        </View>
      )}
      <ModalInfo
        visible={modalVisible}
        onClose={handleInfoModal}
        title={t(`${baseMsg}.profileHelp.title`)}
        description={t(`${baseMsg}.profileHelp.message`)}
        buttonText={t(`${baseMsg}.profileHelp.closeBtnText`)}
      />
    </View>
  );
};

export default NetworkProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkBlack01,
    borderRadius: 16,
    display: "flex",

    paddingTop: 0,
  },
  networkHeader: {
    alignItems: "center",
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  countDownTimer: {
    color: theme.colors.contrast,
    fontSize: 12,
  },
});
