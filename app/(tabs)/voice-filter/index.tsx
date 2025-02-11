import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderPage from "@/components/molecules/HeaderPage/HeaderPage";
import SoundsFilter from "@/components/organisms/SoundsFilter/SoundsFilter";
import ModalInfo from "@/components/molecules/ModalInfo";
import CustomSwitch from "@/components/atoms/Switch";
import { useChangeVoice } from "@/features/voice/useChangeVoice";
import { updateVoice } from "@/features/voice/voiceSlice";
import { setLoading } from "@/features/loading/loadingSlice";
import theme from "@/config/theme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import useModalAll from "@/hooks/useModalAll";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useFocusEffect } from "expo-router";

const VoiceFilter = () => {
  const { t } = useTranslation();
  const { showModal } = useModalAll();
  const currentFilter = useAppSelector((state) => state.voiceFilter);
  const currentSim = useAppSelector((state) => state.sims.currentSim);
  const dispatch = useDispatch();
  const [voiceFilter, setVoiceFilter] = useState(
    currentFilter.filter.toString()
  );
  const [prevVoiceFilter, setPrevVoiceFilter] = useState(currentFilter.filter);
  const [disabled, setDisabled] = useState(true);
  const [showHelperModal, setShowHelperModal] = useState(false);
  const query = useChangeVoice();
  const baseMsg = "pages.voiceFilter";
  const { themeMode } = useDarkModeTheme();

  useFocusEffect(
    useCallback(() => {
      setVoiceFilter(currentFilter.filter.toString());
    }, [currentFilter.filter, voiceFilter])
  );

  useEffect(() => {
    // Update the disabled state based on the voiceFilter value
    if (voiceFilter !== "0") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [voiceFilter]);

  useEffect(() => {
    const loadVoiceFilter = async () => {
      try {
        const storedFilter = await AsyncStorage.getItem("voiceFilter");
        if (storedFilter !== null) {
          setVoiceFilter(storedFilter);
        }
      } catch (error) {
        console.error("Failed to load voice filter from AsyncStorage", error);
      }
    };

    loadVoiceFilter();
  }, []);

  const handleVoiceFilter = async (value) => {
    try {
      dispatch(setLoading(true));
      await query.request(currentSim?.idSim, value);
      dispatch(updateVoice(value));
      setPrevVoiceFilter(value);
      setVoiceFilter(value);

      // Guardar el nuevo valor en AsyncStorage
      await AsyncStorage.setItem("voiceFilter", value.toString());

      dispatch(setLoading(false));
    } catch (error) {
      showModal({
        type: "error",
        oneButton: true,
        title: t("type.error"),
        description: t("modalVoiceFilter.error"),
        textConfirm: t("actions.right"),
        buttonColorConfirm: "#CB0808",
      });
    }
  };

  const handleVoiceFilterDisabled = () => {
    const newDisabledState = !disabled;
    setDisabled(newDisabledState);

    // Solo enviar la petición si el nuevo estado es habilitado (disabled = true)
    if (newDisabledState) {
      handleVoiceFilter("0");
    }
  };

  const handleModal = () => {
    setShowHelperModal(!showHelperModal);
  };

  return (
    <ScrollView
      style={
        themeMode === ThemeMode.Dark
          ? null
          : { backgroundColor: theme.lightMode.colors.white }
      }
    >
      <HeaderEncrypted iconBack="/home" />
      <View
        style={[
          themeMode === ThemeMode.Dark
            ? styles.containerBody
            : {
                ...styles.containerBody,
                backgroundColor: theme.lightMode.colors.white,
              },
        ]}
      >
        <View
          style={[
            themeMode === ThemeMode.Dark
              ? styles.descriptionCard
              : {
                  ...styles.descriptionCard,
                  backgroundColor: theme.lightMode.colors.blueDark,
                },
          ]}
        >
          <IconSvg
            color={theme.colors.iconDefault}
            type="voicechange"
            height={40}
            width={40}
          />
          <Text
            allowFontScaling={false}
            style={[
              themeMode === ThemeMode.Dark
                ? styles.descriptionTitle
                : {
                    ...styles.descriptionTitle,
                    color: theme.lightMode.colors.white,
                  },
            ]}
          >
            {t(`${baseMsg}.description.title`)}
          </Text>
          <Text allowFontScaling={false} style={styles.descriptionMessage}>
            {t(`${baseMsg}.description.message`)}
          </Text>
          <View style={styles.helpLinkContainer}>
            <Pressable onPress={handleModal} style={{ display: "flex" }}>
              <Text allowFontScaling={false} style={styles.titleLink}>
                {t(`helpMessages.howToWork`)}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.containerFilterButtons}>
          <View style={styles.containerTitleSection}>
            <Text
              allowFontScaling={false}
              style={[
                themeMode === ThemeMode.Dark
                  ? styles.titleSection
                  : {
                      ...styles.titleSection,
                      color: theme.lightMode.colors.gray,
                    },
              ]}
            >
              {t(`${baseMsg}.titleFilters`)}
            </Text>
            <View
              style={[
                themeMode === ThemeMode.Dark
                  ? styles.switchWrapper
                  : {
                      ...styles.switchWrapper,
                      backgroundColor: theme.lightMode.colors.blueDark,
                    },
              ]}
            >
              <Text allowFontScaling={false} style={{ color: "white" }}>
                {!disabled ? t(`${baseMsg}.enabled`) : t(`${baseMsg}.disabled`)}
              </Text>
              <View style={styles.scale}>
                <CustomSwitch
                  value={!disabled}
                  onChange={handleVoiceFilterDisabled}
                />
              </View>
            </View>
          </View>
          <SoundsFilter
            voiceFilter={voiceFilter}
            handleVoiceFilter={handleVoiceFilter}
            disabled={disabled}
          />
        </View>
      </View>

      <ModalInfo
        icon={<IconSvg type="filtericon" height={50} width={50} />}
        title={t(`${baseMsg}.tutorial.title`)}
        description={t(`${baseMsg}.tutorial.message`)}
        buttonText={t(`${baseMsg}.tutorial.close`)}
        onClose={handleModal}
        visible={showHelperModal}
      />
    </ScrollView>
  );
};

export default VoiceFilter;

const styles = StyleSheet.create({
  containerBody: {
    display: "flex",
    gap: 25,
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  containerTitleSection: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleSection: {
    color: theme.colors.textContrast,
    ...theme.textVariants.button,
  },
  titleLink: {
    borderBottomWidth: 0.3,
    borderBottomColor: theme.colors.textLInk,
    color: theme.colors.textLInk,
    ...theme.textVariants.descriptionCard,
  },
  containerFilterButtons: {
    display: "flex",
    gap: 10,
  },
  descriptionCard: {
    backgroundColor: theme.colors.mainBackground,
    borderRadius: 8,
    display: "flex",
    gap: 15,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  helpLinkContainer: {
    display: "flex",
    flexDirection: "row",
  },
  descriptionTitle: {
    color: theme.colors.listTitle,
    ...theme.textVariants.button,
  },
  descriptionMessage: {
    color: theme.colors.contentSummary,
    ...theme.textVariants.input,
  },
  filterIconContainer: {
    aspectRatio: 1,
    backgroundColor: "#BBEBFC",
    borderRadius: 16,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: 64,
  },
  buttonClose: {
    fontFamily: theme.textVariants.captionCard.fontFamily,
  },
  scale: {
    transform: "scale(.75)",
  },
  switchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: theme.colors.textContrast,
    backgroundColor: theme.colors.mainBackground,
    padding: 8,
    borderRadius: 12,
  },
});
