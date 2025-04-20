import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, Text, View } from "react-native";
import { deleteSimButtonStyles } from "./deleteSimButtonStyles";
import Icon from "react-native-vector-icons/FontAwesome"; 

const DeleteSimButton = ({ onPress }: { onPress: () => void }) => {
  const { t } = useTranslation();
  const baseMsg = "organism.balanceDetails";

  return (
    <TouchableOpacity style={deleteSimButtonStyles.button} onPress={onPress}>
      <View style={deleteSimButtonStyles.content}>
        <Icon name="trash" size={18} color="#D80E0E" />
        <Text style={deleteSimButtonStyles.text}>{t(`${baseMsg}.delete`)}</Text>delete
      </View>
    </TouchableOpacity>
  );
};

export default DeleteSimButton;