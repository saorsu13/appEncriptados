import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { getStyles } from "./simCurrencySelectorStyles";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SimData = {
  id: string;
  name: string;
  logo: any;
  number: string;
  provider: string;
};

type Props = {
  sims: SimData[];
  selectedId?: string;
  onSelectSim?: (id: string) => void;
};


const SimCurrencySelector: React.FC<Props> = ({ sims, selectedId, onSelectSim }) => {
  console.log("🔄 [SimCurrencySelector] Renderizando componente");

  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const styles = getStyles(isDarkMode);
  const { t } = useTranslation();
  const baseMsg = "pages.home";
  const router = useRouter();

  const [simModalVisible, setSimModalVisible] = useState(false);

  const orderedSims = useMemo(() => {
    const ordenadas = [...sims].sort((a, b) => {
      if (a.provider === "telco-vision" && b.provider === "tottoli") return -1;
      if (a.provider === "tottoli" && b.provider === "telco-vision") return 1;
      return 0;
    });
    console.log("🔃 [SimCurrencySelector] SIMs ordenadas:", ordenadas.map((s) => s.id));
    return ordenadas;
  }, [sims]);
  
  const selectedSim = useMemo(() => {
    const encontrada = orderedSims.find((sim) => sim.id === selectedId) || null;
    console.log("🎯 [SimCurrencySelector] SIM seleccionada en useMemo:", encontrada);
    return encontrada;
  }, [orderedSims, selectedId]);


  useEffect(() => {
    console.log("🧭 [SimCurrencySelector] selectedId actualizada:", selectedId);
    console.log("📦 [SimCurrencySelector] Total SIMs recibidas:", sims.length);
  }, [selectedId, sims]);

  
  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <Text style={styles.label}><Text style={styles.label}>{t(`${baseMsg}.currentSim`)}</Text>
        </Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() =>{
            console.log("📂 [SimCurrencySelector] Abriendo modal de SIMs");
            setSimModalVisible(true);
            }}
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
        onRequestClose={() => {
          console.log("❌ [SimCurrencySelector] Cerrando modal de SIMs");
          setSimModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => {
            console.log("❌ [SimCurrencySelector] Tocando fondo del modal para cerrar");
            setSimModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t(`${baseMsg}.simList`)}</Text>
            <FlatList
              data={orderedSims}
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
                      console.log("🖱 [SimCurrencySelector] SIM seleccionada en modal:", item);
                      setSimModalVisible(false);

                      if (item.id !== selectedId) {
                        console.log("🔁 [SimCurrencySelector] Cambiando SIM a:", item.id);
                        await AsyncStorage.setItem("currentICCID", item.id);
                        console.log("💾 [SimCurrencySelector] Guardada en AsyncStorage");

                        onSelectSim?.(item.id);
                      
                        if (item.provider === "tottoli") {
                          console.log("🧭 [SimCurrencySelector] Navegando a /home por provider 'tottoli'");
                          router.replace({ pathname: "/home", params: { simId: item.id } });
                        }
                      } else {
                        console.log("⏹ [SimCurrencySelector] SIM ya estaba seleccionada:", item.id);
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
                        {item.number.length >= 6 ? "·".repeat(item.number.length - 6) + item.number.slice(-6) : item.number}
                      </Text>
                    </View>
              
                    {!isSixDigitSim && (
                      <TouchableOpacity
                        onPress={() => {
                          console.log("✏️ [SimCurrencySelector] Editar SIM:", item.id);
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
                console.log("➕ [SimCurrencySelector] Navegar para añadir nueva SIM");
                setSimModalVisible(false);
                router.push("/(tabs)/balance/new-sim-encrypted");
              }}
            >
              <Text style={styles.addSimText}>+ {t(`${baseMsg}.newSim`)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SimCurrencySelector;
