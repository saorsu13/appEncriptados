import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

export const passwordKey = "password";
export const disabledKey = "disabled";

const useLocalPassword = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [currentTypingPassword, setCurrentTypingPassword] =
    useState<string>("");

  useEffect(() => {
    const fetchPassword = async () => {
      const password = await getPassword();
      setCurrentPassword(password);
    };
    fetchPassword();
  }, []);

  const savePassword = async (password: string) => {
    try {
      await SecureStore.setItemAsync(passwordKey, password);
      setCurrentPassword(password); // Update currentPassword after saving
    } catch (error) {
      console.error(error);
    }
  };

  const getPassword = async () => {
    try {
      const password = await SecureStore.getItemAsync(passwordKey);
      return password;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteCurrentPassword = async () => {
    try {
      await SecureStore.deleteItemAsync(passwordKey);
      setCurrentPassword(null); // Clear currentPassword after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const updateCurrentTypingPassword = (password: string) => {
    setCurrentTypingPassword(password);
  };

  return {
    savePassword,
    getPassword,
    deleteCurrentPassword,
    currentPassword,
    currentTypingPassword,
    updateCurrentTypingPassword,
    isActive,
  };
};

export default useLocalPassword;
