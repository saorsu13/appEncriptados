import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Usa expo-linear-gradient
import { topUpCardStyles } from "./topUpCardStyles";

const TopUpCard = () => {
  return (
    <LinearGradient
      colors={["#6ADDFF", "#A8EBFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={topUpCardStyles.container}
    >
      {/* Contenido de la tarjeta */}
      <View style={topUpCardStyles.container}>
      {/* Contenedor del texto y botón */}
      <View style={topUpCardStyles.textContainer}>
        <Text style={topUpCardStyles.title}>
          Recargar tu saldo desde la App fácil y rápido
        </Text>

        {/* Botón */}
        <TouchableOpacity style={topUpCardStyles.button}>
          <Text style={topUpCardStyles.buttonText}>Recargar ahora</Text>
        </TouchableOpacity>
      </View>
      {/* Imagen */}
      <Image
        source={require("@/assets/images/image 316.png")}
        style={topUpCardStyles.image}
      />
    </View>
    </LinearGradient>
  );
};

export default TopUpCard;