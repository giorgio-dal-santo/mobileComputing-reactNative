import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useState } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import MenuHomePreview from "../components/MenuHomePreview";

export default function HomeScreen({ navigation }) {
  const [nearbyMenus, setNearbyMenus] = useState([]);
  const [isRegistered, setIsRegistered] = useState(null);

  const userLocation = { lat: 45.4642, lng: 9.19 };

  const loadData = async () => {
    try {
      const viewModel = ViewModel.getViewModel();
      await viewModel.loadLaunchData();
      const isRegistered = await viewModel.isRegistered();
      setIsRegistered(isRegistered);
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
          <Text>Home Screen</Text>
          {isRegistered ? (
            <MenuList nearbyMenus={nearbyMenus} navigation={navigation} />
          ) : (
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
      <Text>Nearby Menus</Text>
      {nearbyMenus.map((menu) => (
        <MenuHomePreview key={menu.mid} menu={menu} />
      ))}
      <Button
        title="Menu Detail"
        onPress={() => navigation.navigate("MenuDetail")}
      />
    </View>
  );
};

const NotRegister = ({navigation}) => {
  return (
    <View style={globalStyle.container}>
      <Text>User not registered</Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate("ProfileStack")}
      />
    </View>
  );
};
