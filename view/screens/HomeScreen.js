import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useState } from "react";
import ViewModel from "../../viewModel/ViewModel";
import LocationViewModel from "../../viewModel/LocationViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import MenuHomePreview from "../components/MenuHomePreview";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import { Linking } from "react-native";

export default function HomeScreen({ navigation }) {
  const [nearbyMenus, setNearbyMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    isRegistered,
    userLocation,
    setUserLocation,
    canUseLocation,
    setCanUseLocation,
  } = useContext(UserContext);

  const locationViewModel = LocationViewModel.getLocationViewModel();

  const loadData = async () => {
    try {
      const viewModel = ViewModel.getViewModel();
      if (canUseLocation && userLocation) {
        const nearbyMenus = await viewModel.getNearbyMenus(userLocation);
        setNearbyMenus(nearbyMenus);
      } else {
        console.log("User not registered or location not available");
      }
    } catch (error) {
      console.error("Error during data initialization:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllowLocation = async () => {
    try {
      await locationViewModel.askForPermission();

      const canUseLocation = await locationViewModel.canUseLocation();
      setCanUseLocation(canUseLocation);

      if (canUseLocation.status === "denied") {
        Alert.alert(
          "Location services are disabled",
          "Please enable location services to use this feature.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Enable",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
      } else if (canUseLocation.status === "granted") {
        locationViewModel.startWatchingLocation(
          (location) => {
            setUserLocation(location);
          },
          (error) => {
            console.error("Error while watching location: ", error);
          }
        );
      }
    } catch (error) {
      console.error("Error while handling location permission: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (canUseLocation.status === "granted" && userLocation) {
        loadData();
      }
    }, [canUseLocation.status, userLocation, isRegistered])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        {canUseLocation.status !== "granted" ? (
          <View style={globalStyle.innerContainer}>
            <Text style={globalStyle.title}>Activate Location Services</Text>
            <Text style={globalStyle.subTitle}>
              To view menus from restaurants near you, please enable location
              services. This helps us show you the best options available in
              your area.
            </Text>
            <TouchableOpacity
              style={[globalStyle.button, globalStyle.enableLocationButton]}
              onPress={async () => await handleAllowLocation()}
            >
              <Text style={globalStyle.buttonTextWhite}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        ): loading ? (
          <View style={globalStyle.innerContainer}>
            <Text style={globalStyle.subTitle}>Loading...</Text>
          </View>
        ) : canUseLocation && userLocation ? (
          <View style={[globalStyle.innerContainer, { alignItems: "center" }]}>
            <MenuList nearbyMenus={nearbyMenus} navigation={navigation} />
          </View>
        ) : (
          <View style={globalStyle.innerContainer}>
            <Text>Error</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuList = ({ nearbyMenus, navigation }) => {
  return (
    <View>
      {nearbyMenus.map((menu) => (
        <MenuHomePreview key={menu.mid} menu={menu} navigation={navigation} />
      ))}
    </View>
  );
};
