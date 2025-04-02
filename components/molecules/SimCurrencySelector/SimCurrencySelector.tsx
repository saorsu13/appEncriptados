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

type SimData = {
  id: string;
  name: string;
  logo: any;
  number: string;
};

type Props = {
  sims: SimData[];
  onSelectSim?: (id: string) => void;
};


const SimCurrencySelector: React.FC<Props> = ({ sims, onSelectSim }) => {
  const { themeMode } = useDarkModeTheme();
  const isDarkMode = themeMode === "dark";
  const styles = getStyles(isDarkMode);
  const router = useRouter();

  // Inicialmente seleccionamos el primer SIM (si existe)
  const [selectedSim, setSelectedSim] = useState<SimData | null>(
    sims.length > 0 ? sims[0] : null
  );
  const [simModalVisible, setSimModalVisible] = useState(false);

  // Actualiza el SIM seleccionado cuando la lista de SIMs cambia.
  // Esto fuerza el re-render en Android si se actualizó la lista.
  useEffect(() => {
    if (sims.length > 0) {
      // Si el SIM actualmente seleccionado ya no existe en la nueva lista, actualiza al primero.
      if (!selectedSim || !sims.some(sim => sim.id === selectedSim.id)) {
        setSelectedSim(sims[0]);
      }
    } else {
      setSelectedSim(null);
    }
  }, [sims]);

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
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.simItem}
                  onPress={() => {
                    setSelectedSim(item);
                    setSimModalVisible(false);
                    onSelectSim?.(item.id);
                  }}
                >
                  <View style={styles.simInfo}>
                    <View style={styles.simNameContainer}>
                      <Text style={styles.simName}>{item.name}</Text>
                    </View>
                    <Image source={item.logo} style={styles.icon} />
                    <Text
                      style={styles.simNumber}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.number}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSimModalVisible(false);
                      router.push(`/balance/new-sim-encrypted/edit-sim-encrypted/${item.id}`);
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={isDarkMode ? "black" : "#1E1E1E"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
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
