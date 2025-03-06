import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveToStorage(key: string, value: string) {
  return await AsyncStorage.setItem(key, value);
}
async function fetchFromStorage(key: string) {
  return await AsyncStorage.getItem(key);
}

async function removeFromStorage(key: string) {
  return await AsyncStorage.removeItem(key);
}
async function clearFromStorage() {
  await AsyncStorage.clear();
}

export { saveToStorage, fetchFromStorage, clearFromStorage, removeFromStorage };
