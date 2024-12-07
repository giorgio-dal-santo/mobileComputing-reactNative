// ASYNC STORAGE MANAGER

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AsyncStorageManager {
  static async saveUserDataToAsyncStorage(uid, sid) {
    try {
      await AsyncStorage.setItem("uid", JSON.stringify(uid));
      await AsyncStorage.setItem("sid", JSON.stringify(sid));
      console.log("Dati salvati:", { uid: uid, sid: sid });
    } catch (error) {
      console.error("Errore durante il salvataggio dei dati utente:", error);
    }
  }

  static async getUid() {
    try {
      const uid = await AsyncStorage.getItem("uid");
      return JSON.parse(uid);
    } catch (error) {
      console.error("Errore durante il recupero dell'UID:", error);
    }
  }

  static async getSid() {
    try {
      const sid = await AsyncStorage.getItem("sid");
      return JSON.parse(sid);
    } catch (error) {
      console.error("Errore durante il recupero del SID:", error);
    }
  }

  static async isFirstRun() {
    const hasAlreadyRun = await AsyncStorage.getItem("hasAlreadyRun");
    const hasAlreadyRunParsed = JSON.parse(hasAlreadyRun);
    if (hasAlreadyRunParsed === null || hasAlreadyRunParsed === false) {
        await AsyncStorage.setItem("hasAlreadyRun", JSON.stringify(true));
        return true;
    }
    return false;
  }

  static async setIsRegistered(isRegistered) {
    try {
      await AsyncStorage.setItem("isRegistered", JSON.stringify(isRegistered));
    } catch (error) {
      console.error("Errore durante il salvataggio dello stato di registrazione:", error);
    }
  }

  static async getIsRegistered() {
    try {
      const isRegistered = await AsyncStorage.getItem("isRegistered");
      return JSON.parse(isRegistered);
    } catch (error) {
      console.error("Errore durante il recupero dello stato di registrazione:", error);
    }
  }
}
