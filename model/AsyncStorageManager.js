import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AsyncStorageManager {
  static async saveUserDataToAsyncStorage(uid, sid) {
    try {
      await AsyncStorage.setItem("uid", JSON.stringify(uid));
      await AsyncStorage.setItem("sid", JSON.stringify(sid));
    } catch (error) {
      console.warn("Error during save user data to storage:", error);
    }
  }

  static async getUid() {
    try {
      const uid = await AsyncStorage.getItem("uid");
      return JSON.parse(uid);
    } catch (error) {
      console.warn("Error during get UID from storage:", error);
    }
  }

  static async getSid() {
    try {
      const sid = await AsyncStorage.getItem("sid");
      return JSON.parse(sid);
    } catch (error) {
      console.warn("Error during get SID from storage:", error);
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
      console.warn("Error during save is registered to storage:", error);
    }
  }

  static async getIsRegistered() {
    try {
      const isRegistered = await AsyncStorage.getItem("isRegistered");
      return JSON.parse(isRegistered);
    } catch (error) {
      console.warn("Error during get is registered from storage:", error);
    }
  }

  static async setCanUseLocation(canUseLocation) {
    try {
      await AsyncStorage.setItem(
        "canUseLocation",
        JSON.stringify(canUseLocation)
      );
    } catch (error) {
      console.warn("Error during save can use location to storage:", error);
    }
  }

  static async getCanUseLocation() {
    try {
      const canUseLocation = await AsyncStorage.getItem("canUseLocation");
      return JSON.parse(canUseLocation);
    } catch (error) {
      console.warn("Error during get can use location from storage:", error);
    }
  }

  static async setMenu(menu) {
    try {
      await AsyncStorage.setItem("menu", JSON.stringify(menu));
    } catch (error) {
      console.warn("Error during save menu to storage:", error);
    }
  }

  static async getMenu() {
    try {
      const menu = await AsyncStorage.getItem("menu");
      return JSON.parse(menu);
    } catch (error) {
      console.warn("Error during get menu from storage:", error);
    }
  }

  static async setOrderData(orderData) {
    try {
      await AsyncStorage.setItem("orderData", JSON.stringify(orderData));
    } catch (error) {
      console.warn("Error during save order data to storage:", error);
    }
  }

  static async getOrderData() {
    try {
      const orderData = await AsyncStorage.getItem("orderData");
      return JSON.parse(orderData);
    } catch (error) {
      console.warn("Error during get order data from storage:", error);
    }
  }

  static async setCurrentScreen(currentScreen) {
    try {
      await AsyncStorage.setItem(
        "currentScreen",
        JSON.stringify(currentScreen)
      );
      console.log("Current screen saved:", currentScreen);
    } catch (error) {
      console.warn("Error during save current screen to storage:", error);
    }
  }

  static async getCurrentScreen() {
    try {
      const currentScreen = await AsyncStorage.getItem("currentScreen");
      return JSON.parse(currentScreen);
    } catch (error) {
      console.warn("Error during get current screen from storage:", error);
    }
  }
}
