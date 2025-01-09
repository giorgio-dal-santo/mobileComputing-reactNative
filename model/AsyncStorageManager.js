// ASYNC STORAGE MANAGER

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AsyncStorageManager {
  static async saveUserDataToAsyncStorage(uid, sid) {
    try {
      await AsyncStorage.setItem("uid", JSON.stringify(uid));
      await AsyncStorage.setItem("sid", JSON.stringify(sid));
      console.log("Dati salvati:", { uid: uid, sid: sid });
    } catch (error) {
      console.warn("Errore durante il salvataggio dei dati utente:", error);
    }
  }

  static async getUid() {
    try {
      const uid = await AsyncStorage.getItem("uid");
      return JSON.parse(uid);
    } catch (error) {
      console.warn("Errore durante il recupero dell'UID:", error);
    }
  }

  static async getSid() {
    try {
      const sid = await AsyncStorage.getItem("sid");
      return JSON.parse(sid);
    } catch (error) {
      console.warn("Errore durante il recupero del SID:", error);
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
      console.warn(
        "Errore durante il salvataggio dello stato di registrazione:",
        error
      );
    }
  }

  static async getIsRegistered() {
    try {
      const isRegistered = await AsyncStorage.getItem("isRegistered");
      return JSON.parse(isRegistered);
    } catch (error) {
      console.warn(
        "Errore durante il recupero dello stato di registrazione:",
        error
      );
    }
  }

  static async setCanUseLocation(canUseLocation) {
    try {
      await AsyncStorage.setItem(
        "canUseLocation",
        JSON.stringify(canUseLocation)
      );
    } catch (error) {
      console.warn(
        "Errore durante il salvataggio dello stato di utilizzo della posizione:",
        error
      );
    }
  }

  static async getCanUseLocation() {
    try {
      const canUseLocation = await AsyncStorage.getItem("canUseLocation");
      return JSON.parse(canUseLocation);
    } catch (error) {
      console.warn(
        "Errore durante il recupero dello stato di utilizzo della posizione:",
        error
      );
    }
  }

  static async setMenu(menu) {
    try {
      await AsyncStorage.setItem("menu", JSON.stringify(menu));
      console.log("Menu salvato:", menu.mid);
    } catch (error) {
      console.warn("Errore durante il salvataggio del menu:", error);
    }
  }

  static async getMenu() {
    try {
      const menu = await AsyncStorage.getItem("menu");
      return JSON.parse(menu);
    } catch (error) {
      console.warn("Errore durante il recupero del menu:", error);
    }
  }

  static async setOrderData(orderData) {
    try {
      await AsyncStorage.setItem("orderData", JSON.stringify(orderData));
      console.log("Dati dell'ordine salvati:", orderData.oid);
    } catch (error) {
      console.warn(
        "Errore durante il salvataggio dei dati dell'ordine:",
        error
      );
    }
  }

  static async getOrderData() {
    try {
      const orderData = await AsyncStorage.getItem("orderData");
      return JSON.parse(orderData);
    } catch (error) {
      console.warn("Errore durante il recupero dei dati dell'ordine:", error);
    }
  }
}
