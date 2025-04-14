import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { deleteSimButtonStyles } from "./deleteSimButtonStyles";
import Icon from "react-native-vector-icons/FontAwesome"; 

const DeleteSimButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={deleteSimButtonStyles.button} onPress={onPress}>
      <View style={deleteSimButtonStyles.content}>
        <Icon name="trash" size={18} color="#D80E0E" />
        <Text style={deleteSimButtonStyles.text}>Borrar SIM</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeleteSimButton;