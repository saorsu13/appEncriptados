import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./simCurrencySelectorStyles"; // Importamos los estilos

const sims = [
  { id: "1", name: "Nicolas", logo: require("@/assets/images/tim_icon_app_600px_negativo 1.png"), number: "23442345911" },
];

const currencies = [
  { id: "COP", name: "COP", flag: require("@/assets/images/Colombia.png") },
  { id: "CAD", name: "CAD", flag: require("@/assets/images/Canada.png") },
];

const SimCurrencySelector = () => {
  const [selectedSim, setSelectedSim] = useState(sims[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const [simModalVisible, setSimModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* SIM Actual */}
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>SIM ACTUAL</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setSimModalVisible(true)}>
          <View style={styles.selectorContent}>
            <View style={styles.simNameContainer}>
              <Text style={styles.selectorText}>{selectedSim.name}</Text>
            </View>

            <Image source={selectedSim.logo} style={styles.icon} />
          </View>
          <Ionicons name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Divisa */}
      <View style={styles.currencyContainer}>
        <Text style={styles.label}>DIVISA</Text>
        <View style={styles.currencyWrapper}>
          <TouchableOpacity style={styles.selector} onPress={() => setCurrencyModalVisible(true)}>
            <View style={styles.selectorContent}>
              <Text style={styles.selectorText}>{selectedCurrency.name}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="gray" />
          </TouchableOpacity>
          {/* Contenedor de la bandera */}
          <View style={styles.flagContainer}>
            <Image source={selectedCurrency.flag} style={styles.currencyFlag} />
          </View>
        </View>
      </View>

      {/* SIM Modal */}
      <Modal visible={simModalVisible} transparent animationType="fade" onRequestClose={() => setSimModalVisible(false)}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setSimModalVisible(false)}>
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
                  }}
                >
                  <View style={styles.simInfo}>
                    <View style={styles.simNameContainer}>
                      <Text style={styles.simName}>{item.name}</Text>
                    </View>
                    <Image source={item.logo} style={styles.icon} />
                    <Text style={styles.simNumber}>{item.number}</Text>
                  </View>
                  <Ionicons name="create-outline" size={20} color="#1E1E1E" />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.addSimButton}>
              <Text style={styles.addSimText}>+ Añadir nueva SIM</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Modal */}
      <Modal visible={currencyModalVisible} transparent animationType="fade" onRequestClose={() => setCurrencyModalVisible(false)}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setCurrencyModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccionar Divisa</Text>
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyItem}
                  onPress={() => {
                    setSelectedCurrency(item);
                    setCurrencyModalVisible(false);
                  }}
                >
                  <Image source={item.flag} style={styles.currencyFlag} />
                  <Text style={styles.currencyText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SimCurrencySelector;