import Button from "@/components/atoms/Button/Button";
import Label from "@/components/atoms/Label/Label";
import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import theme from "@/config/theme";
import { useDispatch } from "react-redux";
import { updateCurrentSim, updateSimName } from "@/features/sims/simSlice";
import { router } from "expo-router";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useModalAdminSims } from "@/context/modaladminsims";

const SimListModal = () => {
  const { closeModal, isModalOpen } = useModalAdminSims();
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const sims = useAppSelector((state: any) => state.sims.sims);
  const dispatch = useDispatch();
  const baseMsg = "pages.home";

  const globalCurrency = useAppSelector((state) => state.currency.currency);

  const [editingSimId, setEditingSimId] = useState<number | null>(null);
  const [newSimName, setNewSimName] = useState<string>("");

  const handleUpdateCurrentSim = (idSim: number) => {
    closeModal();
    dispatch(updateCurrentSim(idSim));
  };

  const addNewSim = () => {
    router.push("/new-sim/");
    closeModal();
  };

  const handleClose = () => {
    closeModal();
  };

  const handleUpdateSimName = () => {
    if (editingSimId !== null) {
      dispatch(updateSimName({ idSim: editingSimId, newName: newSimName }));
      setEditingSimId(null);
      setNewSimName("");
    }
  };

  const { colors } = useTheme<ThemeCustom>();

  return (
    <Modal animationType="fade" transparent={true} visible={isModalOpen}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.modalContainer}>
                <View
                  style={[
                    themeMode === ThemeMode.Dark
                      ? styles.modalContent
                      : {
                          ...styles.modalContent,
                          backgroundColor: theme.lightMode.colors.blueDark,
                        },
                  ]}
                >
                  <Label
                    label={t(`${baseMsg}.simList`)}
                    customStyles={styles.textLabel}
                  />

                  <View style={[styles.simList]}>
                    {sims.map((sim) => (
                      <Button
                        key={sim.idSim}
                        onClick={() => handleUpdateCurrentSim(sim.idSim)}
                        variant={"light"}
                        customStyles={styles.simButton}
                      >
                        <View
                          style={[
                            Platform.OS === "android"
                              ? {
                                  flexDirection: "row",
                                  width: 300,
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }
                              : styles.simButtonContentWrapper,
                          ]}
                        >
                          <View style={styles.iconWrapper}>
                            <IconSvg height={20} width={20} type="sim2" />
                            <Text
                              allowFontScaling={false}
                              style={theme.textVariants.button}
                            >
                              {sim.simName}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={styles.simNumberText}
                            >
                              ({sim.idSim})
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => {
                              closeModal();
                              router.push(`/new-sim/edit-sim/${sim.idSim}`);
                            }}
                            style={styles.iconPressable}
                          >
                            <IconSvg height={20} width={20} type="edit" />
                          </Pressable>
                        </View>
                      </Button>
                    ))}

                    <Button
                      onClick={addNewSim}
                      customStyles={[styles.simButton, styles.simButtonPrimary]}
                    >
                      <View style={styles.simButtonContentWrapper}>
                        <View style={styles.iconWrapper}>
                          <IconSvg type="add" height={15} width={15} />
                          <Text
                            allowFontScaling={false}
                            style={[
                              theme.textVariants.button,
                              { color: theme.colors.contrast },
                            ]}
                          >
                            {t(`${baseMsg}.newSim`)}
                          </Text>
                        </View>
                      </View>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SimListModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  modalView: {
    margin: 20,

    borderRadius: 24,

    alignItems: "center",
    elevation: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  modalContainer: {
    display: "flex",
    gap: 5,
    width: "100%",
  },
  modalContent: {
    backgroundColor: theme.colors.darkBlack01,
    borderColor: theme.colors.darkBlack05,
    borderRadius: 24,
    borderWidth: 0.5,
    display: "flex",
    gap: 15,

    padding: 20,
  },
  textLabel: {
    color: theme.colors.contrast,
    width: "100%",
  },
  simButtonContentWrapper: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  simButton: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    fontFamily: theme.textVariants.titleCard.fontFamily,
    width: "100%",
  },
  simButtonPrimary: {
    marginLeft: 10,
    fontFamily: theme.textVariants.button.fontFamily,
  },
  simNumberText: {
    marginLeft: 5,
    fontFamily: theme.textVariants.textInfo.fontFamily,
  },
  editInputContainer: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
    width: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.contrast,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: theme.colors.contrast,
    width: "60%",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  iconPressable: {
    padding: 2, // Aumenta el área de toque
  },
  simList: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
