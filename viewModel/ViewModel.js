// VIEW MODEL

import AsyncStorageManager from "../model/AsyncStorageManager.js";
import DBManager from "../model/DBManager.js";
import CommunicationController from "../model/CommunicationController.js";
import User from "../model/type/User.js";

export default class ViewModel {
  static #viewModel = null;

  constructor() {
    if (ViewModel.#viewModel) {
      throw new Error("Access should happen via getViewModel()");
    }

    this.uid = null;
    this.sid = null;
    this.dbManager = new DBManager();
    this.hasAlreadyRun = false;
  }

  static getViewModel() {
    if (!ViewModel.#viewModel) {
      ViewModel.#viewModel = new ViewModel();
    }
    return ViewModel.#viewModel;
  }

  async isRegistered() {
    return await AsyncStorageManager.getIsRegistered();
  }

  async loadLaunchData() {
    this.hasAlreadyRun = await AsyncStorageManager.isFirstRun();
    if (this.hasAlreadyRun) {
      const response = await CommunicationController.registerUser();
      this.uid = response.uid;
      this.sid = response.sid;
      await AsyncStorageManager.saveUserDataToAsyncStorage(this.uid, this.sid);
      await AsyncStorageManager.setIsRegistered(false);
    } else {
      this.uid = await AsyncStorageManager.getUid();
      this.sid = await AsyncStorageManager.getSid();
    }

    const userData = await this.getUserData();

    return userData;
  }

  async getUserData() {
    try {
      const userData = await CommunicationController.getUserData(
        this.sid,
        this.uid
      );
      return new User(
        userData.firstName,
        userData.lastName,
        userData.cardFullName,
        userData.cardNumber,
        userData.cardExpireMonth,
        userData.cardExpireYear,
        userData.cardCVV,
        userData.uid,
        userData.lastOid,
        userData.orderStatus
      );
    } catch (error) {
      console.error("Error during getUserData:", error);
    }
  }

  async saveUserData(userFormData) {
    try {
      let userData = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        cardFullName: userFormData.cardFullName,
        cardNumber: userFormData.cardNumber,
        cardExpireMonth: parseInt(userFormData.cardExpireMonth),
        cardExpireYear: parseInt(userFormData.cardExpireYear),
        cardCVV: userFormData.cardCVV,
        sid: this.sid,
      };
      userData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );

      await CommunicationController.putUserData(
        this.uid,
        userData
      );
      await AsyncStorageManager.setIsRegistered(true);
      console.log("Data saved successfully:", userData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }
}
