import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import theme from "@/config/theme";
import { useDispatch } from "react-redux";
import { updateCurrentSim, updateSimName } from "@/features/sims/simSlice";
import { router } from "expo-router";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useModalAdminSims } from "@/context/modaladminsims";
import { Ionicons } from "@expo/vector-icons";

const SimListModal = () => {
  const {
    simsList: sims,
    closeModal,
    isModalOpen
  } = useModalAdminSims();
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === ThemeMode.Dark;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const baseMsg = "pages.home";


  const [editingSimId, setEditingSimId] = useState<number | null>(null);
  const [newSimName, setNewSimName] = useState<string>("");

  const handleUpdateCurrentSim = (id: number) => {
    closeModal();
    dispatch(updateCurrentSim(id));
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
      dispatch(updateSimName({ id: editingSimId, newName: newSimName }));
      setEditingSimId(null);
      setNewSimName("");
    }
  };

  const { colors } = useTheme<ThemeCustom>();
  const styles = getStyles(isDarkMode);
  const validSims = sims.filter((sim) => sim && sim.id);

  return (
    <Modal animationType="fade" transparent={true} visible={isModalOpen}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t(`${baseMsg}.simList`)}</Text>

              <FlatList
                data={validSims}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSixDigitSim = item.iccid.toString().length === 6;
                  const simImage = isSixDigitSim
                    ? require("@/assets/images/adaptive-icon.png")
                    : item.logo || require("@/assets/images/tim_icon_app_600px_negativo 1.png");

                  return (
                    <Pressable
                      style={styles.simItem}
                      onPress={() => handleUpdateCurrentSim(item.id)}
                    >
                      <View style={styles.simInfo}>
                        <View style={styles.simNameContainer}>
                          <Text style={styles.simName}>{item.simName || item.name}</Text>
                        </View>
                        <Image
                          source={simImage}
                          style={
                            isSixDigitSim
                              ? { width: 30, height: 30, borderRadius: 10, resizeMode: 'cover' }
                              : { width: 25, height: 25, resizeMode: 'contain' }
                          }
                        />
                        <Text
                          style={styles.simNumber}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.iccid}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          closeModal();
                          router.push(`/new-sim/edit-sim/${item.id}`);
                        }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color={themeMode === ThemeMode.Dark ? "black" : "#1E1E1E"}
                        />
                      </TouchableOpacity>
                    </Pressable>
                  );
                }}
              />
              <TouchableOpacity
                style={styles.addSimButton}
                onPress={addNewSim}
              >
                <Text style={styles.addSimText}>+ Añadir nueva SIM</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SimListModal;

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: isDarkMode ? "#121212" : "#E5F9FF",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: isDarkMode ? "white" : "#1E1E1E",
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  simItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#fff" : "#F7F7F7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  simInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  simNameContainer: {
    backgroundColor: isDarkMode ? "#363636" : "#C6EDFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  simName: {
    color: isDarkMode ? "white" : "#1E1E1E",
    fontSize: 12,
    fontWeight: "bold",
  },
  simNumber: {
    color: "#1E1E1E",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
    maxWidth: 150,
    flexShrink: 1,
  },
  addSimButton: {
    backgroundColor: "#00AEEF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginTop: 10,
    width: "100%",
  },
  addSimText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
  },
});