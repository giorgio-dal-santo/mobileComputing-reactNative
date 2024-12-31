import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
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
      if (isRegistered && canUseLocation && userLocation) {
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

      if (canUseLocation) {
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
      if (isRegistered && canUseLocation && userLocation) {
        loadData();
      }
    }, [canUseLocation, userLocation, isRegistered])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        {isRegistered && canUseLocation && userLocation ? (
          <View style={globalStyle.innerContainer}>
            <Text style={globalStyle.title}>Nearby Menus</Text>
            <MenuList nearbyMenus={nearbyMenus} navigation={navigation} />
          </View>
        ) : isRegistered && !canUseLocation ? (
          <View style={globalStyle.innerContainer}>
            <Text>Location not available</Text>
            <Button
              title="Allow location"
              onPress={async () => {
                await handleAllowLocation();
              }}
            />
          </View>
        ) : !isRegistered ? (
            <NotRegister navigation={navigation} />
        ) : loading ? (
          <View style={globalStyle.innerContainer}>
            <Text>Loading...</Text>
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

const NotRegister = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>User not registered</Text>
      <TouchableOpacity
        style={[
          globalStyle.button,
          { backgroundColor: "green", borderColor: "green" },
        ]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={[globalStyle.buttonText, { color: "#fff" }]}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};
