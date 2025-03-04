import AsyncStorageManager from "../model/AsyncStorageManager.js";
import DBManager from "../model/DBManager.js";
import CommunicationController from "../model/CommunicationController.js";
import User from "../model/type/User.js";
import Menu from "../model/type/Menu.js";
import Order from "../model/type/Order.js";

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

    const isRegistered = await this.isRegistered();

    const userData = await this.getUserData();
    const orderData = new Order(userData.lastOid, userData.orderStatus);

    return [userData, orderData, isRegistered];
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
      console.warn("Error during getUserData:", error);
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

      await CommunicationController.putUserData(this.uid, userData);
      await AsyncStorageManager.setIsRegistered(true);
      console.log("Data saved successfully:", userData);
    } catch (error) {
      console.warn("Error saving data:", error);
    }
  }

  async getMenuImage(mid, imageVersion) {
    try {
      const imageInStore = await this.dbManager.getImageByImageVersion(
        mid,
        imageVersion
      );
      if (imageInStore) {
        return imageInStore;
      }

      console.log("Image not found in DB, fetching from server...");
      let imageFromServer = await CommunicationController.getMenuImage(
        mid,
        this.sid
      );

      if (!imageFromServer.base64.startsWith("data:image")) {
        imageFromServer.base64 =
          "data:image/png;base64," + imageFromServer.base64;
      }
      await this.dbManager.insertMenuImage(
        mid,
        imageVersion,
        imageFromServer.base64
      );
      return imageFromServer.base64;
    } catch (error) {
      console.warn("Error fetching image:", error);
    }
  }

  async getNearbyMenus(userLocation) {
    if (!this.sid) {
      throw new Error("No sid found");
    }
    let fetchedMenus = await CommunicationController.getNearbyMenus(
      userLocation.lat,
      userLocation.lng,
      this.sid
    );
    const menuPromises = fetchedMenus.map(async (menu) => {
      const image = await this.getMenuImage(menu.mid, menu.imageVersion);
      return new Menu(
        menu.mid,
        menu.name,
        menu.price,
        menu.location,
        menu.imageVersion,
        menu.shortDescription,
        menu.deliveryTime,
        null,
        image
      );
    });
    const menus = await Promise.all(menuPromises);
    return menus;
  }

  async getMenuDetail(mid, lat, lng) {
    const menu = await CommunicationController.getMenuDetail(
      mid,
      lat,
      lng,
      this.sid
    );
    const image = await this.getMenuImage(menu.mid, menu.imageVersion);
    return new Menu(
      menu.mid,
      menu.name,
      menu.price,
      menu.location,
      menu.imageVersion,
      menu.shortDescription,
      menu.deliveryTime,
      menu.longDescription,
      image
    );
  }

  async newOrder(userLocation, mid, lat, lng) {
    const order = await CommunicationController.buyMenu(
      this.sid,
      userLocation,
      mid
    );

    const menu = await this.getMenuDetail(mid, lat, lng);

    return new Order(
      order.oid,
      order.status,
      order.mid,
      order.uid,
      order.creationTimestamp,
      order.deliveryLocation,
      order.deliveryTimestamp,
      order.expectedDeliveryTimestamp,
      order.currentPosition,
      menu.location
    );
  }

  async getOrderDetail(oid) {
    try {
      const orderDetail = await CommunicationController.getOrderDetail(
        oid,
        this.sid
      );

      return new Order(
        orderDetail.oid,
        orderDetail.status,
        orderDetail.mid,
        orderDetail.uid,
        orderDetail.creationTimestamp,
        orderDetail.deliveryLocation,
        orderDetail.deliveryTimestamp,
        orderDetail.expectedDeliveryTimestamp,
        orderDetail.currentPosition
      );
    } catch (error) {
      console.warn("Error getting order details:", error);
    }
  }

  async getLastMenu() {
    try {
      const savedMenu = await AsyncStorageManager.getMenu();
      return savedMenu;
    } catch (error) {
      console.warn("Error loading persisted data:", error);
    }
  }

  async getLastOrderData() {
    try {
      const savedOrderData = await AsyncStorageManager.getOrderData();
      return savedOrderData;
    } catch (error) {
      console.warn("Error loading persisted data:", error);
    }
  }

  async setMenuAndOrderDataToStorage(menu, orderData) {
    try {
      await AsyncStorageManager.setMenu(menu);
      await AsyncStorageManager.setOrderData(orderData);
    } catch (error) {
      console.warn("Error saving menu or orderData:", error);
    }
  }

  async setCurrentScreen(currentScreen) {
    try {
      await AsyncStorageManager.setCurrentScreen(currentScreen);
    } catch (error) {
      console.warn("Error saving current screen:", error);
    }
  }

  async getCurrentScreen() {
    try {
      const currentScreen = await AsyncStorageManager.getCurrentScreen();
      return currentScreen;
    } catch (error) {
      console.warn("Error loading current screen:", error);
    }
  }

  // modified
  /*
  async getIngredients(mid) {
    try {
      const ingredients = await CommunicationController.getIngredients(mid, this.sid);
      return ingredients;
    } catch (error) {
      console.warn("Error getting ingredients:", error);
    }
  }
  */
}
