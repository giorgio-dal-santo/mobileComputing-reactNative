import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useState } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import MenuHomePreview from "../components/MenuHomePreview";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  const [nearbyMenus, setNearbyMenus] = useState([]);

  // instead of using state we have to use context
  const { isRegistered } = useContext(UserContext);
  //const [isRegistered, setIsRegistered] = useState(null);

  
  const userLocation = { lat: 45.4642, lng: 9.19 };

  const loadData = async () => {
    try {
      const viewModel = ViewModel.getViewModel();
      if (isRegistered) {
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
    }, [isRegistered])
  );

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          {isRegistered ? (
            <MenuList nearbyMenus={nearbyMenus} userLocation={userLocation} navigation={navigation} />
          ) : (
            <NotRegister navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuList = ({ nearbyMenus, userLocation, navigation }) => {

  return (
    <View style={globalStyle.container}>
      <Text style={globalStyle.title}>Nearby Menus</Text>
      {nearbyMenus.map((menu) => (
        <MenuHomePreview key={menu.mid} menu={menu} userLocation={userLocation} navigation={navigation} />
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
