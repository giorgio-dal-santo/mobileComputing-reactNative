import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import MenuCardPreview from "../components/MenuCardPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

export default function ProfileScreen({ navigation }) {
  const { isRegistered, userData, orderData, setOrderData, userLocation } =
    useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const [menu, setMenu] = useState(null);

  const isFocused = useIsFocused();
  const intervalId = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    const loadAndSyncData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        console.log("Fetching data...");
        // 1. Caricamento iniziale dei dati da AsyncStorage
        const [savedMenu, savedOrderData] =
          await viewModel.getMenuAndOrderDataFromStorage();
        if (savedMenu) setMenu(savedMenu);
        if (savedOrderData) setOrderData(savedOrderData);

        // 2. Aggiorna i dati con il fetch dal server, se necessario
        if (savedOrderData?.mid && savedOrderData?.menuLocation) {
          const fetchedMenu = await viewModel.getMenuDetail(
            savedOrderData.mid,
            savedOrderData.menuLocation.lat,
            savedOrderData.menuLocation.lng
          );
          setMenu((prevMenu) => {
            if (!prevMenu || prevMenu.mid !== fetchedMenu.mid) {
              console.log("Fetched Menu mid: ", fetchedMenu.mid);
              return fetchedMenu;
            }
            return prevMenu;
          });
        }

        if (menu && savedOrderData.oid) {
          const fetchedOrder = await viewModel.getOrderDetail(
            savedOrderData.oid,
            menu.mid,
            menu.location.lat,
            menu.location.lng
          );
          setOrderData({
            ...savedOrderData,
            ...fetchedOrder,
          });
          console.log(
            "Updated OrderData oid + status: ",
            orderData.oid,
            orderData.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isFetching.current = false;
      }
    };

    if (isFocused) {
      console.log("Screen order is focused");
      loadAndSyncData();
      intervalId.current = setInterval(loadAndSyncData, 5000);
    } else {
      console.log("Screen order is not focused");
      clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isFocused]);

  // Salvataggio automatico dei dati aggiornati nello Storage
  useEffect(() => {
    const saveDataToStorage = async () => {
      try {
        await viewModel.setMenuAndOrderDataToStorage(menu, orderData);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    if (menu || orderData) saveDataToStorage();
  }, [menu, orderData]);

  if (!isRegistered) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={globalStyle.mainContainer}>
          <NotRegister navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        <View style={globalStyle.profileContainer}>
          <View style={globalStyle.profileImage}>
            <Ionicons name="person-circle-outline" size={70} color="#444" />
          </View>

          <Text style={globalStyle.profileName}>
            {userData.firstName} {userData.lastName}
          </Text>

          <View style={globalStyle.profileDetails}>
            <Text style={globalStyle.profileDetailText}>
              Card Full Name: {userData.cardFullName}
            </Text>
            <Text style={globalStyle.profileDetailText}>
              Card Number: **** **** **** {userData.cardNumber.slice(-4)}
            </Text>
            <Text style={globalStyle.profileDetailText}>
              Expire Date: {userData.cardExpireMonth}/{userData.cardExpireYear}
            </Text>
            <Text style={globalStyle.profileDetailText}>CVV: ***</Text>

            <TouchableOpacity
              style={globalStyle.button}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={globalStyle.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {userData?.lastOid || orderData.oid ? (
          <View style={globalStyle.innerContainer}>
            <Text style={[globalStyle.title, { marginLeft: 20 }]}>
              Last Order:{" "}
            </Text>
            <MenuCardPreview menu={menu} />
          </View>
        ) : !userData.lastOid && !orderData.oid ? (
          <View style={globalStyle.innerContainer}>
            <Text style={[{ marginLeft: 20 }]}>No order yet</Text>
            <Text style={[{ marginRight: 20 }]}>Order Now Bottone</Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const NotRegister = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>User not registered</Text>
      <TouchableOpacity
        style={[
          globalStyle.button,
          { backgroundColor: "green", borderColor: "green" },
        ]}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={[globalStyle.buttonText, { color: "#fff" }]}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};