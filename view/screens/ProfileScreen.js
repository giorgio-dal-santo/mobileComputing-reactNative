import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View, Image, ScrollView, SafeAreaView } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import MenuCardPreview from "../components/MenuCardPreview";
import { userLocation } from "../components/MenuHomePreview";

import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";


export default function ProfileScreen({ navigation }) {
  //instead of using state we have to use context
  const { isRegistered, userData, orderData, setOrderData } =
    useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const [menu, setMenu] = useState(null);

  const fetchLastOrder = async () => {
    //console.log("Executing FetchLastOrder 2")
    try {
      const orderDetails = await viewModel.getOrderDetail(orderData.oid);
      setOrderData(orderDetails);
      //console.log("Settato order data 3");
      const menu = await viewModel.getMenuDetail(
        orderData.mid,
        orderData.deliveryLocation.lat,
        orderData.deliveryLocation.lng
      );
      setMenu(menu);
      //console.log("Menu", menu);
      //console.log("Menu Name:", menu.name);
    } catch (err) {
      console.error("Error fetching the last order details:", err);
    }
  };

  const fetchData = async () => {
    //console.log("Fetching Data 1");
    if (orderData && orderData.oid) await fetchLastOrder();
  };

  // Auto - Reload every 5 seconds
  const isFocused = useIsFocused(); // Tracks if the screen is currently focused
  const intervalId = useRef(null);

  useEffect(() => {
    //console.log("UseEffect 4");
    if (isFocused) {
      console.log("Screen is focused, starting timer");
      fetchData();
      intervalId.current = setInterval(fetchData, 5000);
    } else {
      console.log("Screen is not focused, stopping timer");
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }

    // Cleanup function to stop the timer when the component unmounts
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isFocused]);

  if (!isRegistered) {
    return (
      <View style={globalStyle.container}>
        <Text>Profile Screen</Text>
        <Text>User not registered</Text>
        <TouchableOpacity
          style={[
            globalStyle.button,
            { backgroundColor: "green", borderColor: "green" },
          ]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={[globalStyle.buttonText, { color: "#fff" }]}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
    const getMenuName = async () => {
        console.log("Order Data:", orderData);
        console.log("delivery location:", orderData.deliveryLocation);
        const menuName = await viewModel.getMenuDetail(orderData.mid, orderData.deliveryLocation.lat, orderData.deliveryLocation.lng).name;
        console.log("Menu Name:", menuName);
        return menuName;
    };
    */

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
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


          {orderData.oid ? (
            <View style={globalStyle.container}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Text style={[globalStyle.title, { marginLeft: 20 }]}>Last Order: </Text>
                <TouchableOpacity
                  style={[
                    globalStyle.button,
                    { paddingHorizontal: 15, backgroundColor: '#fff', marginRight: 20 },
                  ]}
                  onPress={() =>
                    navigation.navigate("HomeStack", {
                      screen: "MenuDetail", // Specifica la schermata nidificata
                      params: {
                        menuid: menu.mid,
                        lat: menu.location.lat,
                        lng: menu.location.lng,
                        userLocation: userLocation,
                      },
                    })
                  }
                >
                  <Text style={globalStyle.buttonText}>Go to the Menu Details</Text>
                </TouchableOpacity>

              </View>
              <View>
                <MenuCardPreview menu={menu} />
              </View>
            </View>

          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Text style={[{ marginLeft: 20 }]}>No order yet</Text>
              <Text style={[{ marginRight: 20 }]}>Order Now Bottone</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

//<Text>Order Status: {orderData?.status || "N/A"}</Text>
