import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStyles } from "./simCurrencySelectorStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SimData = {
  id: string;
  name: string;
  logo: any;
  number: string;
};

type Props = {
  sims: SimData[];
  selectedId?: string;
  onSelectSim?: (id: string) => void;
};


const SimCurrencySelector: React.FC<Props> = ({ sims, selectedId, onSelectSim }) => {
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const styles = getStyles(isDarkMode);
  const router = useRouter();

  const [simModalVisible, setSimModalVisible] = useState(false);

  const selectedSim = sims.find((sim) => sim.id === selectedId) || null;
  console.log("🧠 currentSim en SimCurrencySelector:", selectedSim);
  
  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>SIM ACTUAL</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setSimModalVisible(true)}
        >
          <View style={styles.selectorContent}>
            <View style={styles.simNameContainer}>
              <Text style={styles.selectorText}>
                {selectedSim ? selectedSim.name : "Sim TIM"}
              </Text>
            </View> 
            <Image
              source={
                selectedSim
                  ? selectedSim.logo
                  : require("@/assets/images/tim_icon_app_600px_negativo 1.png")
              }
              style={styles.icon}
            />
          </View>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDarkMode ? "white" : "gray"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={simModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSimModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setSimModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Mis SIMs disponibles</Text>
            <FlatList
              data={sims}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSixDigitSim = item.id.length === 6;
                const simImage = isSixDigitSim
                  ? require("@/assets/images/adaptive-icon.png")
                  : item.logo;
              
                return (
                  <TouchableOpacity
                    style={styles.simItem}
                    onPress={async () => {
                      console.log("🖱 SIM seleccionada en modal:", item);
                      setSimModalVisible(false);
                      if (item.id !== selectedId) {
                        console.log("🔁 Cambiando SIM actual a:", item.id);
                        onSelectSim?.(item.id);
                        await AsyncStorage.setItem("currentICCID", item.id);
                        console.log("🔁 Navegando a /home con simId:", item.id);
                        router.replace({ pathname: "/home", params: { simId: item.id } });
                      }
                    }}
                    
                  >
                    <View style={styles.simInfo}>
                      <View style={styles.simNameContainer}>
                        <Text style={styles.simName}>{item.name}</Text>
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
                        {item.number}
                      </Text>
                    </View>
              
                    {!isSixDigitSim && (
                      <TouchableOpacity
                        onPress={() => {
                          setSimModalVisible(false);
                          router.push(
                            `/balance/new-sim-encrypted/edit-sim-encrypted/${item.id}`
                          );
                        }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color={isDarkMode ? "black" : "#1E1E1E"}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              }}              
            />
            <TouchableOpacity
              style={styles.addSimButton}
              onPress={() => {
                setSimModalVisible(false);
                router.push("/(tabs)/balance/new-sim-encrypted");
              }}
            >
              <Text style={styles.addSimText}>+ Añadir nueva SIM</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SimCurrencySelector;
