import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { deleteSimButtonStyles } from "./deleteSimButtonStyles";
import IconSvg from "@/components/molecules/IconSvg/IconSvg"; // Asegúrate de que el ícono es el correcto

const DeleteSimButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={deleteSimButtonStyles.button} onPress={onPress}>
      <View style={deleteSimButtonStyles.content}>
        <IconSvg type="trash" width={18} height={18} color="#FF3B30" />
        <Text style={deleteSimButtonStyles.text}>Borrar SIM</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeleteSimButton;