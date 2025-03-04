import * as Location from "expo-location";
import AsyncStorage from "../model/AsyncStorageManager";

export default class LocationViewModel {
  static #LocationViewModel = null;
  #locationSubscription = null;

  constructor() {
    if (LocationViewModel.#LocationViewModel) {
      throw new Error("Access should happen via getLocationViewModel()");
    }
  }

  static getLocationViewModel() {
    if (!LocationViewModel.#LocationViewModel) {
      LocationViewModel.#LocationViewModel = new LocationViewModel();
    }
    return LocationViewModel.#LocationViewModel;
  }

  async canUseLocation() {
    return await AsyncStorage.getCanUseLocation();
  }

  async getPermission() {
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    console.log("Location permission granted: ", grantedPermission.status);

    const canUseLocation = { status: "undetermined" };

    if (grantedPermission.status === "granted") {
      canUseLocation.status = "granted";
      await AsyncStorage.setCanUseLocation(canUseLocation);
    } else if (grantedPermission.status === "denied") {
      canUseLocation.status = "denied";
      await AsyncStorage.setCanUseLocation(canUseLocation);
    } else {
      canUseLocation.status = "undetermined";
      await AsyncStorage.setCanUseLocation(canUseLocation);
    }

    return canUseLocation;
  }

  async askForPermission() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status === "granted") {
      await AsyncStorage.setCanUseLocation({ status: "granted" });
    }
  }

  async startWatchingLocation(onLocationUpdate, onError) {
    const canUseLocation = await this.canUseLocation();
    if (!canUseLocation) {
      console.log("Location not available");
      return null;
    }

    try {
      this.#locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const formattedLocation = {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          };
          console.log("Updated location: ", formattedLocation);
          if (onLocationUpdate) {
            onLocationUpdate(formattedLocation);
          }
        }
      );
    } catch (error) {
      console.warn("Error during location update:", error);
      if (onError) {
        onError(error);
      }
    }
  }

  stopWatchingLocation() {
    if (this.#locationSubscription) {
      this.#locationSubscription.remove();
      this.#locationSubscription = null;
      console.log("Location watching stopped");
    }
  }
}
