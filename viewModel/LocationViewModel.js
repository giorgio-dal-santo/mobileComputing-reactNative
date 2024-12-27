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

    async getPermission () {
        const grantedPermission = await Location.getForegroundPermissionsAsync();
        //const canUseLocation = await AsyncStorage.getCanUseLocation();
        //console.log("Permission: ", grantedPermission);
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
            const permission = await Location.requestForegroundPermissionsAsync();
            if (permission.status === "granted") {
                await AsyncStorage.setCanUseLocation(true);
            }
        }

        const canUseLocation = await this.canUseLocation();

        return [canUseLocation];
    };


    async startLocationUpdates () {
        try {
            const hasPermission = await getPermission();
            if (!hasPermission) return;


            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 2000, // Ogni 2 secondi
                    distanceInterval: 1, // Ogni 1 metro
                },
                (newLocation) => {
                    setLocation(newLocation);
                    console.log("Location aggiornata: ", newLocation);
                }
            );


            setLocationSubscription(subscription);
        } catch (error) {
            console.error("Errore durante l'aggiornamento della posizione:", error);
        }
    };


    stopLocationUpdates() {
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
            console.log("Location subscription rimossa");
        }
    };

    /*
        useEffect(() => {
            return () => {
                stopLocationUpdates();
            };
        }, []);
    */


    /*
    const handleRegionChanged = (region) => {
      console.log(region);
    };
   */
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


}


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


