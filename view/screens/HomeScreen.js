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
  
      console.log("Can use location after asking permission: ", canUseLocation);
  
      if (canUseLocation) {
        const userLocation = await locationViewModel.getLocation();
        console.log("User location after granting permission: ", userLocation);
        setUserLocation(userLocation);
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
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          {
          isRegistered && canUseLocation && userLocation ? (
            <MenuList nearbyMenus={nearbyMenus} navigation={navigation} />
          ) : isRegistered && !canUseLocation ? (
            <View>
              <Text>Location not available</Text>
              <Button title="Allow location" onPress={async () => {await handleAllowLocation()}} />
            </View>
          ) : !isRegistered ? (
            <NotRegister navigation={navigation} />
          ) : loading ? (
            <View>
              <Text>Loading...</Text>
            </View>
          ) : (
            <View>
              <Text>Error</Text>
            </View>
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
        <Text style={[globalStyle.buttonText, { color: "#fff" }]}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};
