import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_LAUNCHED_KEY = 'has_launched_app_before';

export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
    if (hasLaunched === null) {
      await AsyncStorage.setItem(HAS_LAUNCHED_KEY, 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking first launch:', error);
    return false;
  }
};

export const resetFirstLaunchFlag = async () => {
  await AsyncStorage.removeItem(HAS_LAUNCHED_KEY);
};