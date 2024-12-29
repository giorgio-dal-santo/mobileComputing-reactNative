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

  const { isRegistered, userLocation, setUserLocation, canUseLocation } = useContext(UserContext);

  const locationViewModel = LocationViewModel.getLocationViewModel();

  const loadData = async () => {
    try {
      const viewModel = ViewModel.getViewModel();
      if (isRegistered && canUseLocation) {
        const nearbyMenus = await viewModel.getNearbyMenus(userLocation);
        setNearbyMenus(nearbyMenus);
      }
    } catch (error) {
      console.error("Error during ViewModel initialization:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [isRegistered, canUseLocation, userLocation])
  );

  const handleAllowLocation = async () => {
    await locationViewModel.askForPermission();
    const userLocation = await locationViewModel.getUserLocation();
    setUserLocation(userLocation);
  }

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          {isRegistered && canUseLocation ? (
            <MenuList nearbyMenus={nearbyMenus} navigation={navigation} />
          ) : isRegistered && !canUseLocation ? (
            <View>
              <Text>Location not available</Text>
              <Button title="Allow location" onPress={handleAllowLocation} />
            </View>
          )
          : (
            <NotRegister navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuList = ({ nearbyMenus, navigation }) => {
  return (
    <View style={globalStyle.container}>
      <Text style={globalStyle.title}>Nearby Menus</Text>
      {nearbyMenus.map((menu) => (
        <MenuHomePreview key={menu.mid} menu={menu} navigation={navigation} />
      ))}
    </View>
  );
};

const NotRegister = ({ navigation }) => {
  return (
    <View style={globalStyle.container}>
      <Text>User not registered</Text>
      <TouchableOpacity
        style={[
          globalStyle.button,
          { backgroundColor: "green", borderColor: "green" },
        ]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={[globalStyle.buttonText, { color: "#fff" }]}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};
