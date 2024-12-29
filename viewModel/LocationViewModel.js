import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Linking } from "react-native";
import MapView from "react-native-maps";
import AsyncStorage from "../model/AsyncStorageManager";

export default class LocationViewModel {
  static #LocationViewModel = null;
  //#locationSubscription = null;

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
    } else {
      await AsyncStorage.setCanUseLocation(false);
    }

    const canUseLocation = await this.canUseLocation();

    console.log("Can use location LocationViewModel: ", canUseLocation);

    return canUseLocation;
  }

  async askForPermission() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status === "granted") {
      await AsyncStorage.setCanUseLocation(true);
    }
  }

  async getLocation() {
    const canUseLocation = await this.canUseLocation();

    if (!canUseLocation) {
      console.warn("Permessi per la posizione non concessi.");
      return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const formattedLocation = {
        latitude: parseFloat(location.coords.latitude),
        longitude: parseFloat(location.coords.longitude),
      }
      console.log("User location: ", formattedLocation);
      return formattedLocation;
    } catch (error) {
      console.error("Errore nel recupero della posizione: ", error);
      return null;
    }
  }
}


/*
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
          const { latitude, longitude } = newLocation.coords;
          console.log("Location aggiornata: ", latitude, longitude);
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
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
  */

/*
   
    render = function () {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    //onRegionChange={handleRegionChanged}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                </MapView>
            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});
*/
