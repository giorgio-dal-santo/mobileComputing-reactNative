import * as Location from "expo-location";
import { Alert } from "react-native";
import { Linking } from "react-native";
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
    console.log("Permission granted: ", grantedPermission.status);

    if (grantedPermission.status === "granted") {
      await AsyncStorage.setCanUseLocation(true);
      return true;
    } else if (!grantedPermission.canAskAgain) {
      Alert.alert(
        "Permessi posizione",
        "I permessi per accedere alla posizione sono stati negati. Per attivarli, vai nelle impostazioni del dispositivo.",
        [
          { text: "Impostazioni", onPress: () => Linking.openSettings() },
          { text: "Annulla" },
        ]
      );
      await AsyncStorage.setCanUseLocation(false);
      return false;
    } else {
      await AsyncStorage.setCanUseLocation(false);
      return false;
    }
  }

  async askForPermission() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status === "granted") {
      await AsyncStorage.setCanUseLocation(true);
    }
  }

  async startWatchingLocation(onLocationUpdate, onError) {
    const canUseLocation = await this.canUseLocation();
    if (!canUseLocation) {
      console.log("Non posso usare la posizione");
      return null;
    }

    try {
      this.#locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000, // Ogni 2 secondi
          distanceInterval: 1, // Ogni 1 metro
        },
        (newLocation) => {
          const formattedLocation = {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          };
          console.log("Location aggiornata: ", formattedLocation);
          if (onLocationUpdate) {
            onLocationUpdate(formattedLocation);
          }
        }
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento della posizione:", error);
      if (onError) {
        onError(error);
      }
    }
  }

  stopWatchingLocation() {
    if (this.#locationSubscription) {
      this.#locationSubscription.remove();
      this.#locationSubscription = null;
      console.log("Monitoraggio posizione interrotto");
    }
  }
}
