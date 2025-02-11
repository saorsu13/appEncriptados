import theme from "@/config/theme";
import { Modal, StyleSheet, View, ActivityIndicator } from "react-native";

type props = {
  visible: boolean;
};

const Loader = ({ visible = false }: props) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={theme.colors.softSKin} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
