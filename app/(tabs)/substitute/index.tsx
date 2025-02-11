import React, { useCallback, useEffect, useState, useTransition } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import theme from "@/config/theme";
import RadioButton from "@/components/molecules/RadioButton/RadioButton";

import Button from "@/components/atoms/Button/Button";
import { useChangeSubstitute } from "@/features/substitute/useChangeSubstitute";
import { updateSubstitute } from "@/features/substitute/substituteSlice";
import { setLoading } from "@/features/loading/loadingSlice";
import CardIcon from "@/components/molecules/CardIcon/CardIcon";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import AlertButton from "@/components/molecules/AlertButton/AlertButton";
import useModalAll from "@/hooks/useModalAll";
import PhoneInput from "@/components/molecules/PhoneInput/PhoneInput";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSubstitutionNumber } from "@/api/substitute";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import {
  countries,
  countriesCodes,
} from "@/components/organisms/SImCountry/countries";
import Section from "@/components/molecules/SectionDistributors/Section";
import SkeletonContent from "@/components/molecules/SkeletonContent";
import { useModalPassword } from "@/context/modalpasswordprovider";
import PinRequiredScreen from "@/components/molecules/PinInputScreen/PinRequiredScreen";

interface SubstituteState {
  mode: "dynamic" | "manual";
  countryCode: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
}
interface CodeInfo {
  country_phone_code: string;
  country_code: string;
  phone_number: string | null;
}

interface SubstitutionData {
  has_substitution_number: boolean;
  code_info: CodeInfo;
  substitution_number_active: boolean;
}

const Substitute = () => {
  const { isModalVisible } = useModalPassword();

  const quertclient = useQueryClient();
  const {
    data,
    isFetching,
    isLoading,
    refetch,
  }: UseQueryResult<SubstitutionData, Error> = useQuery({
    queryKey: ["getSubstitutionNumber"],
    gcTime: 0,

    queryFn: async () => {
      try {
        await quertclient.invalidateQueries["getSubstitutionNumber"];
        return await getSubstitutionNumber(currentSim.idSim);
      } catch (error) {}
    },
  });

  const [currentSubstitute, setCurrentSubstitute] =
    useState<SubstituteState | null>({
      mode: "dynamic",
      countryCode: "",
      countryPhoneCode: "",
      phoneNumber: "",
    });

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  useEffect(() => {
    if (data) {
      setCurrentSubstitute(
        produce((draft) => {
          draft.countryCode = data?.code_info?.country_code;
          draft.countryPhoneCode = data?.code_info?.country_phone_code;
          draft.mode = "dynamic";
          draft.phoneNumber = data?.code_info?.phone_number;
        })
      );
    }
  }, [data]);

  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const query = useChangeSubstitute();

  const dispatch = useDispatch();
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const [simNumber, setSimNumber] = useState("");
  const [substituteMode, setSubstituteMode] = useState<
    "dynamic" | "manual" | undefined
  >(undefined);

  const baseMsg = "pages.substitute";
  const mockData = [
    {
      value: "dynamic",
      label: `${baseMsg}.dynamic.label`,
      description: `${baseMsg}.dynamic.description`,
    },
    {
      value: "manual",
      label: `${baseMsg}.manual.label`,
    },
  ];
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [errorNumberManual, setErrorNumberManual] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const [inputEditable, setInputEditable] = useState(false);

  const changeSubstitute = async (value, type) => {
    try {
      if (!modalRequiredPassword) {
        dispatch(setLoading(true));
      }

      setAlertSuccess(false);
      setIsValid(false);
      if (type === "manual") {
        const response = await query.requestManual(
          currentSubstitute,
          currentSim?.idSim
        );

        if (response.data === null || response.data.status !== "success") {
          setErrorNumberManual(true);
        }

        if (response.data.status === "success") {
          dispatch(setLoading(false));
          setIsValid(true);
          setAlertSuccess(true);
        }
      } else {
        await query.requestDynamic(currentSim?.idSim);
      }
    } catch (error) {
      setErrorNumberManual(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSimNumber = (value) => {
    setSimNumber(value?.replace(/[^0-9]/g, ""));
  };

  currentSubstitute.countryCode;
  const handleSubstituteMode = (value) => {
    if (value === "dynamic") {
      showModal({
        type: "alert",
        title: t(`pages.substitute.dynamic.label`),
        description: t("pages.substitute.dynamic.areYouSureDynamic"),
        textConfirm: t("actions.changeNow"),
        textCancel: t("actions.close"),
        buttonColorCancel: "#CB0808",
        buttonColorConfirm: "#10B4E7",
        onConfirm: async () => {
          try {
            const emptyValue = {
              countryCode: 0,
              countryPhoneCode: 0,
              mode: "dynamic",
              phoneNumber: 0,
            };
            await query.requestManual(emptyValue, currentSim.idSim);

            setSubstituteMode(value);
            setAlertSuccess(false);

            setCurrentSubstitute(
              produce((draft) => {
                draft.countryCode = "";
                draft.countryPhoneCode = "";
                draft.mode = "dynamic";
                draft.phoneNumber = "0";
              })
            );
            setInputEditable(true);
            setIsValid(false);
          } catch (error) {
            console.error(error);
          }
        },
      });
    } else {
      setSubstituteMode("manual");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.substitution_number_active) {
        setInputEditable(false);
      } else {
        setInputEditable(true);
      }
    }, [data?.substitution_number_active])
  );

  useEffect(() => {
    if (currentSubstitute?.phoneNumber)
      setIsValid(
        currentSubstitute?.phoneNumber.length >= 7 &&
          currentSubstitute?.phoneNumber.length <= 12 &&
          currentSubstitute?.countryPhoneCode !== "0" &&
          currentSubstitute?.countryPhoneCode !== "" &&
          currentSubstitute?.countryCode !== "0" &&
          currentSubstitute?.countryCode !== ""
      );
  }, [currentSubstitute, isValid]);

  const handleModal = () => {
    setShowHelperModal(!showHelperModal);
  };

  const { showModal } = useModalAll();

  useEffect(() => {
    if (currentSubstitute?.phoneNumber) {
      setErrorNumberManual(false);
    }
  }, [currentSubstitute]);

  useEffect(() => {}, []);

  const handleSubstitutePhone = (obj) => {
    handleSimNumber(obj.phoneNumber);
    setCurrentSubstitute(obj);
    setIsValid(obj.success);
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.substitution_number_active) {
        setSubstituteMode("manual");
      } else {
        setSubstituteMode("dynamic");
      }
      if (data?.substitution_number_active) {
        setAlertSuccess(true);
      } else {
        setAlertSuccess(false);
      }
      if (substituteMode === "dynamic") {
        setIsValid(false);
      }
      refetch();
    }, [refetch, data])
  );

  useEffect(() => {
    if (isFetching && !modalRequiredPassword) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [isFetching]);
  const { colors } = useTheme<ThemeCustom>();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <ScrollView
        contentContainerStyle={[
          themeMode === ThemeMode.Dark
            ? styles.scrollViewContainer
            : {
                ...styles.scrollViewContainer,
                backgroundColor: theme.lightMode.colors.white,
              },
        ]}
      >
        <HeaderEncrypted iconBack="/home" title={t(`${baseMsg}.title`)} />

        <View style={styles.containerBody}>
          <View style={styles.cardIconContainer}>
            <CardIcon>
              <IconSvg
                color={theme.colors.iconDefault}
                height={50}
                width={50}
                type="multiplesettings"
              />
            </CardIcon>
          </View>

          <>
            <View style={styles.containerOptions}>
              {mockData.map((item, index) => (
                <RadioButton
                  key={`${index}-${item}`}
                  handleChange={handleSubstituteMode}
                  handleBlur={() => {}}
                  value={item.value}
                  selectedValue={substituteMode}
                  variant="voicefilter"
                >
                  <View style={styles.radioLabelContainer}>
                    <Text allowFontScaling={false} style={styles.radioLabel}>
                      <Text
                        allowFontScaling={false}
                        style={
                          item.value === substituteMode
                            ? themeMode === ThemeMode.Dark
                              ? { color: theme.lightMode.colors.white }
                              : themeMode === ThemeMode.Light
                              ? { color: theme.lightMode.colors.blueDark }
                              : null
                            : null
                        }
                      >
                        {t(item.label)}
                      </Text>
                    </Text>
                    {item?.description && (
                      <Text
                        allowFontScaling={false}
                        style={styles.descriptionLabel}
                      >
                        {t(item.description)}
                      </Text>
                    )}
                  </View>
                </RadioButton>
              ))}
            </View>

            {substituteMode === "manual" && (
              <View style={{ display: "flex", gap: 10 }}>
                <View style={styles.containerTitleSection}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      themeMode === ThemeMode.Dark
                        ? styles.titleSection
                        : {
                            ...styles.titleSection,
                            color: theme.lightMode.colors.blueDark,
                          },
                    ]}
                  >
                    {t(`${baseMsg}.titleCountry`)}
                  </Text>
                  <Pressable onPress={handleModal}>
                    <Text
                      onPress={() =>
                        showModal({
                          type: "help",
                          oneButton: true,
                          buttonColorConfirm: colors.danger,
                          title: t("helpMessages.howToWork"),
                          description: t("pages.substitute.help.message"),
                          textConfirm: t("actions.close"),
                        })
                      }
                      allowFontScaling={false}
                      style={
                        themeMode === ThemeMode.Dark
                          ? styles.titleLink
                          : {
                              ...styles.titleLink,
                              color: theme.lightMode.colors.blueDark,
                            }
                      }
                    >
                      {t(`helpMessages.howToWork`)}
                    </Text>
                  </Pressable>
                </View>

                <View>
                  {currentSubstitute !== null ? (
                    <PhoneInput
                      countryCode={currentSubstitute.countryCode}
                      onChange={handleSubstitutePhone}
                      value={currentSubstitute}
                      disabled={!inputEditable}
                      styles={{
                        backgroundColor:
                          themeMode === ThemeMode.Dark
                            ? isValid
                              ? theme.colors.inputStatusSuccessBG
                              : theme.colors.complementaryText
                            : isValid
                            ? "#eef5e7"
                            : "white",
                        borderColor:
                          themeMode === ThemeMode.Dark
                            ? isValid
                              ? theme.colors.inputStatusSuccess
                              : theme.colors.borderInput
                            : isValid
                            ? theme.colors.inputStatusSuccess
                            : "#222222",
                        color:
                          themeMode === ThemeMode.Dark
                            ? theme.colors.smootText
                            : "#222222",
                        backgroundColorModal:
                          themeMode === ThemeMode.Dark
                            ? theme.colors.complementaryText
                            : "white",
                      }}
                    />
                  ) : null}
                </View>
              </View>
            )}

            <View style={styles.containerContentInformative}>
              <Text allowFontScaling={false} style={styles.informativeText}>
                {t(`${baseMsg}.${substituteMode}.tutorial`)}
              </Text>
            </View>

            {substituteMode == "manual" ? (
              <>
                {alertSuccess ? (
                  <AlertButton
                    message={t(`${baseMsg}.manual.messageSuccess`)}
                    type="success"
                  />
                ) : null}

                {!currentSubstitute?.phoneNumber ? (
                  <Button
                    variant="primaryPress"
                    onClick={() => {
                      setInputEditable(false);
                      changeSubstitute(simNumber, substituteMode);
                    }}
                    disabled={!isValid}
                  >
                    {t(`actions.toActive`)}
                  </Button>
                ) : null}
              </>
            ) : null}

            {substituteMode === "manual" ? (
              <View>
                {currentSubstitute?.phoneNumber ? (
                  <Button
                    onClick={() => {
                      if (!inputEditable) {
                        setInputEditable(true);
                      } else {
                        setInputEditable(false);
                        changeSubstitute(simNumber, substituteMode);
                      }
                    }}
                    disabled={!isValid}
                  >
                    {!inputEditable &&
                    currentSubstitute?.countryPhoneCode !== "0" &&
                    currentSubstitute?.countryPhoneCode !== "" &&
                    currentSubstitute?.countryCode !== "0" &&
                    currentSubstitute?.countryCode !== ""
                      ? t(`actions.changeNumber`)
                      : t(`actions.toActive`)}
                  </Button>
                ) : null}
              </View>
            ) : null}
          </>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Substitute;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  containerBody: {
    display: "flex",
    flex: 1,
    gap: 25,
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  cardIconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  containerOptions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
  },
  radioLabelContainer: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
  },
  radioLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    color: "#919191",
    width: "100%",
    ...theme.textVariants.textInfo,
  },
  descriptionLabel: {
    color: theme.colors.contentSummary,
    fontSize: 14,
  },
  containerContentInformative: {
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  informativeText: {
    color: "#C5C5C5",
    textAlign: "center",
    ...theme.textVariants.titleInformative,
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
    fontSize: 12,
    lineHeight: 14,
  },
  titleLink: {
    color: theme.colors.textLInk,
    ...theme.textVariants.descriptionCard,
  },
});
