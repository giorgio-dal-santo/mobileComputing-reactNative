import { useCallback } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import MenuCardPreview from "../components/MenuCardPreview";

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
      console.log("Settato order data 3");
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
        <Button
          title="Register"
          onPress={() => navigation.navigate("EditProfile")}
        />
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
    <View style={globalStyle.container}>
      <View>
        <Text>Profile Screen</Text>
        <Text>First Name: {userData.firstName}</Text>
        <Text>Last Name: {userData.lastName}</Text>
        <Text>Card Full Name: {userData.cardFullName}</Text>
        <Text>Card Number: {userData.cardNumber}</Text>
        <Text>Card Expire Month: {userData.cardExpireMonth}</Text>
        <Text>Card Expire Year: {userData.cardExpireYear}</Text>
        <Text>Card CVV: {userData.cardCVV}</Text>
        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate("EditProfile")}
        />
      </View>

      <View>
        <Text style={globalStyle.title}> Last Order: </Text>
        {orderData.oid ? (
          <MenuCardPreview menu={menu} />
        ) : (
          <Text>No order data available</Text>
        )}
      </View>
    </View>
  );
}

//<Text>Order Status: {orderData?.status || "N/A"}</Text>
