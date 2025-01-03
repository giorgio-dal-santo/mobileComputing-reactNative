import { Text, View, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { use, useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function OrderScreen({ navigation }) {
  const { isRegistered, orderData, setOrderData, lastMenu, setLastMenu } =
    useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const isFocused = useIsFocused();
  const intervalId = useRef(null);

  useEffect(() => {
    const getDataFromStorage = async () => {
      try {
        const savedMenu = await viewModel.getLastMenu();
        const savedOrderData = await viewModel.getLastOrderData();

        if (savedMenu) setLastMenu(savedMenu);
        if (savedOrderData) setOrderData(savedOrderData);

        console.log("Data successfully loaded from storage.");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getDataFromStorage();
  }, []);

  useEffect(() => {
    const currentOrderData = async () => {
      try {
        if (orderData.oid) {
          const updatedOrderData = await viewModel.getOrderDetail(
            orderData.oid
          );
          setOrderData(updatedOrderData);
          console.log(
            "Updated order data: ",
            updatedOrderData.status,
            updatedOrderData.currentPosition
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const saveDataToStorage = async () => {
      try {
        if (lastMenu && orderData) {
          await viewModel.setMenuAndOrderDataToStorage(lastMenu, orderData);
          console.log("Data successfully saved to storage.");
          console.log("Last menu location: ", lastMenu.location.lat, lastMenu.location.lng);

        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    if (isFocused) {
      console.log("Screen order is focused");
      currentOrderData();
      intervalId.current = setInterval(currentOrderData, 5000);
    }

    return () => {
      console.log("Component unmounted or screen is no longer focused");
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      saveDataToStorage();
    };
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={globalStyle.mainContainer}>
          {isRegistered ? (
            <OrderStatus navigation={navigation} />
          ) : (
            <NotRegister navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderStatus = ({ navigation }) => {
  const { userData, orderData, lastMenu } = useContext(UserContext);

  if (!userData.lastOid && !orderData.oid) {
    return (
      <View style={globalStyle.innerContainer}>
        <Text style={globalStyle.title}>No order yet</Text>
        <TouchableOpacity
          style={globalStyle.button}
          onPress={() => navigation.navigate("HomeStack")}
        >
          <Text style={globalStyle.buttonText}>Order</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {!orderData || !lastMenu ? (
        <View style={globalStyle.header}>
          <Text>Loading...</Text>
        </View>
      ) : orderData?.status === "ON_DELIVERY" ? (
        <View style={globalStyle.innerContainer}>
          <View style={globalStyle.subContainer}>
            <Text style={globalStyle.title}>
              Your order will arrive at: {orderData.expectedDeliveryTimestamp}
            </Text>
            <Text style={globalStyle.title}>
              MAPPA: mostrare luogo di consegna, luogo di partenza, traiettoria
              drone
            </Text>
          </View>
          {lastMenu.location?.lat &&
            lastMenu.location?.lat &&
            orderData?.deliveryLocation ? (
            <View style={globalStyle.mapContainer}>
              <MapView
                style={globalStyle.map}
                initialRegion={{
                  latitude: lastMenu.location.lat,
                  longitude: lastMenu.location.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
              <Marker
                coordinate={{
                  latitude: lastMenu.location.lat,
                  longitude: lastMenu.location.lng,
                }}
                title="Menu Location"
                description="This is the menu location"
              />
              <Marker
                coordinate={{
                  latitude: orderData.deliveryLocation.lat,
                  longitude: orderData.deliveryLocation.lng,
                }}
                title="Delivery Location"
                description="This is the delivery location"
              />
            </View>
          ) : (
            <View style={globalStyle.subContainer}>
              <Text>Loading map data...</Text>
            </View>
          )}
          <MenuCardPreview />
        </View>
      ) : orderData?.status === "COMPLETED" ? (
        <View style={globalStyle.innerContainer}>
          <View style={globalStyle.subContainer}>
            <Text style={globalStyle.title}>Your order has been delivered</Text>
            <Text>MAPPA con luogo di consegna</Text>
          </View>
          {orderData.deliveryLocation ? (
            <View style={globalStyle.mapContainer}>
              <MapView
                style={globalStyle.map}
                initialRegion={{
                  latitude: orderData.deliveryLocation.lat,
                  longitude: orderData.deliveryLocation.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              />
              <Marker
                coordinate={{
                  latitude: orderData.deliveryLocation.lat,
                  longitude: orderData.deliveryLocation.lng,
                }}
                title="Delivery Location"
                description="This is the delivery location"
              />
            </View>
          ) : (
            <View style={globalStyle.subContainer}>
              <Text>Loading map data...</Text>
            </View>
          )}
          <MenuCardPreview />
          <TouchableOpacity
            style={globalStyle.button}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeStack", params: { screen: "Home" } }],
              })
            }
          >
            <Text style={globalStyle.buttonText}>Order Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={globalStyle.header}>
          <Text>No active order</Text>
        </View>
      )}
    </View>
  );
};

const NotRegister = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>User not registered</Text>
      <TouchableOpacity
        style={[globalStyle.button]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={globalStyle.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};
