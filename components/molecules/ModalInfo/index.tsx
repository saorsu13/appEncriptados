import Button from "@/components/atoms/Button/Button";
import Label from "@/components/atoms/Label/Label";
import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type props = {
  onClose?: () => void;
  visible?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: any;
};

const ModalInfo = ({
  onClose = () => {},
  visible = false,
  title = "",
  description = "",
  buttonText = "Close",
  icon = null,
}: props) => {
  const handleClose = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const { themeMode } = useDarkModeTheme();

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Pressable style={styles.centeredView} onPress={handleClose}>
        <View style={styles.modalView}>
          <View style={styles.modalContainer}>
            <View
              style={
                themeMode === ThemeMode.Light
                  ? styles.modalContent
                  : {
                      ...styles.modalContent,
                      backgroundColor: theme.colors.darkBlack01,
                    }
              }
            >
              <View style={styles.containerHeader}>
                {icon}
                <Label
                  label={title}
                  variant="primary"
                  customStyles={styles.textLabel}
                />
              </View>
              <View style={styles.container}>
                <View>
                  <Text
                    allowFontScaling={false}
                    style={
                      themeMode === ThemeMode.Light
                        ? styles.message
                        : {
                            ...styles.message,
                            color: theme.lightMode.colors.white,
                          }
                    }
                  >
                    {description}
                  </Text>
                </View>
                <Button
                  onClick={onClose}
                  variant={themeMode === ThemeMode.Light ? "primary" : "dark"}
                >
                  <Text
                    allowFontScaling={false}
                    style={
                      themeMode === ThemeMode.Light
                        ? { color: theme.lightMode.colors.white }
                        : { color: theme.lightMode.colors.white }
                    }
                  >
                    {buttonText}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalInfo;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
    elevation: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  modalContainer: {
    display: "flex",
    gap: 5,
    width: "100%",
  },
  containerHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBlockColor: "#D9D9D9",
    width: "100%",
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  modalContent: {
    backgroundColor: theme.colors.contrast,
    borderColor: theme.colors.darkBlack05,
    borderRadius: 24,
    borderWidth: 0.5,
    display: "flex",
    gap: 15,
    padding: 20,
  },
  message: {
    textAlign: "left",
    color: theme.colors.contentSummary,
    paddingHorizontal: 10,
    marginBottom: 15,
    ...theme.textVariants.contentSummary,
  },
  textLabel: {
    textAlign: "left",
  },
});
