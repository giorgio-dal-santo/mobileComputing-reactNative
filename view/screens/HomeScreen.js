import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import LocationViewModel from "../../viewModel/LocationViewModel";
import MenuHomePreview from "../components/MenuHomePreview";
import LoadingView from "../components/LoadingView";
import { UserContext } from "../context/UserContext";

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
  const viewModel = ViewModel.getViewModel();

  useEffect(() => {
    const loadScreen = async () => {
      try {
        const currentScreen = await viewModel.getCurrentScreen();
        console.log("Current screen: ", currentScreen);

        if(!currentScreen) {
          return;
        }

        if (currentScreen.name === "Profile") {
          navigation.navigate("ProfileStack", {
            screen: "Profile",
            params: currentScreen.params,
          });
        } else if (currentScreen.name === "EditProfile") {
          navigation.navigate("ProfileStack", {
            screen: "EditProfile",
            params: currentScreen.params,
          });
        } else if (currentScreen.name === "Order") {
          navigation.navigate("Order", {
            screen: "Order",
            params: currentScreen.params,
          });
        } else {
          navigation.navigate("HomeStack", currentScreen.params);
        }
      } catch (error) {
        console.error("Error navigating to the current screen:", error);
      }
    };
    if (!loading) loadScreen();
  }, [loading]);

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
      console.warn("Error during data initialization:", error);
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
            console.warn("Error while watching location: ", error);
          }
        );
      }
    } catch (error) {
      console.warn("Error while handling location permission: ", error);
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
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );

  function renderContent() {
    if (canUseLocation.status !== "granted") {
      return <ActivateLocationView onAllowLocation={handleAllowLocation} />;
    }

    if (loading) {
      return <LoadingView />;
    }

    if (canUseLocation && userLocation) {
      return <MenuListView menus={nearbyMenus} navigation={navigation} />;
    }

    return null;
  }
}

const ActivateLocationView = ({ onAllowLocation }) => (
  <View style={globalStyle.innerContainer}>
    <Text style={globalStyle.title}>Activate Location Services</Text>
    <Text style={globalStyle.subTitle}>
      To view menus from restaurants near you, please enable location services.
      This helps us show you the best options available in your area.
    </Text>
    <TouchableOpacity
      style={[globalStyle.button, globalStyle.enableLocationButton]}
      onPress={onAllowLocation}
    >
      <Text style={globalStyle.buttonTextWhite}>Enable Location</Text>
    </TouchableOpacity>
  </View>
);

const MenuListView = ({ menus, navigation }) => (
  <View style={[globalStyle.innerContainer, { alignItems: "center" }]}>
    <Text style={globalStyle.title}>Best Menus Around You</Text>
    <View>
      {menus.map((menu) => (
        <MenuHomePreview key={menu.mid} menu={menu} navigation={navigation} />
      ))}
    </View>
  </View>
);
