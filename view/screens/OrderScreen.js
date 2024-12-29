import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import LocationViewModel from "../../viewModel/LocationViewModel";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";

export default function OrderScreen({ navigation }) {
  const { isRegistered, orderData, setOrderData } = useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const [lastOrder, setLastOrder] = useState(null);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const fetchedOrder = await viewModel.getOrderDetail(orderData.oid);
        setLastOrder(fetchedOrder);

        console.log("Fetched Order: ", fetchedOrder);

        if (fetchedOrder && fetchedOrder.mid && fetchedOrder.menuLocation) {
          const fetchedMenu = await viewModel.getMenuDetail(
            fetchedOrder.mid,
            fetchedOrder.menuLocation.lat,
            fetchedOrder.menuLocation.lng
          );
          setMenu(fetchedMenu);

          console.log("Fetched Menu: ", fetchedMenu);
          
        }
      } catch (error) {
        console.error("Error during data initialization:", error);
      }
    };

    if (orderData && orderData.oid) fetchLastOrder();
  }, [orderData]);

  /*

  const fetchLastOrder = async () => {
    console.log("Executing Fetch");
    try {
      const lastOrder = await viewModel.getOrderDetail(orderData.oid);
      setLastOrder(lastOrder);

      const menu = await viewModel.getMenuDetail(
        orderDetails.mid,
        orderDetails.menuLocation.lat,
        orderDetails.menuLocation.lng
      );
      setMenu(menu);

    } catch (err) {
      console.error("Error fetching the last order details:", err);
    }
  };

  const fetchData = async () => {
    if (orderData && orderData.oid) await fetchLastOrder();
  };

  // Auto - Reload every 5 seconds
  const isFocused = useIsFocused(); // Tracks if the screen is currently focused
  const intervalId = useRef(null);

  useEffect(() => {
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
  
  */

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        {isRegistered ? (
          <OrderStatus
            orderData={lastOrder}
            menu={menu}
            navigation={navigation}
          />
        ) : (
          <NotRegister navigation={navigation} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderStatus = ({ orderData, menu, navigation }) => {
  const render = () => {
    console.log("map render");
    if (!orderData) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={globalStyle.mapContainer}>
        <MapView
          style={globalStyle.map}
          initialRegion={{
            latitude: orderData.menuLocation.lat,
            longitude: orderData.menuLocation.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
      </View>
    );
  };

  if (!orderData) {
    return (
      <View>
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
    <View style={globalStyle.container}>
      {orderData.status === "ON_DELIVERY" ? (
        <View>
          <Text style={globalStyle.title}>
            Your order will arrive at: {orderData.expectedDeliveryTimestamp}
          </Text>
          <Text style={globalStyle.title}>
            MAPPA: mostrare luogo di consegna, luogo di partenza, traiettoria
            drone
          </Text>
          <Text>
            menu Latitude: {orderData.menuLocation.lat} - menu Longitude:{" "}
            {orderData.menuLocation.lng}
          </Text>
          <MenuCardPreview menu={menu} />
        </View>
      ) : orderData.status === "COMPLETED" ? (
        <View>
          <Text style={globalStyle.title}>Your order has been delivered</Text>
          <Text>MAPPA con luogo di consegna</Text>
          <View style={globalStyle.container}>
            <Text>Delivery Location</Text>
            <Text>
              delivery Latitude: {orderData.deliveryLocation.lat} - delivery
              Longitude: {orderData.deliveryLocation.lng}
            </Text>
            <MenuCardPreview menu={menu} />
            <TouchableOpacity
              style={globalStyle.button}
              onPress={() =>
                navigation.reset({
                  index: 0, // Index of the route to reset to (0 bc is Home)
                  routes: [{ name: "HomeStack", params: { screen: "Home" } }],
                })
              }
            >
              <Text style={globalStyle.buttonText}>Order Again</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
          </View>
        </View>
      ) : (
        <View>
          <Text>No active order</Text>
        </View>
      )}
    </View>
  );
};

const NotRegister = ({ navigation }) => {
  return (
    <View style={globalStyle.container}>
      <Text style={globalStyle.title}>User not registered</Text>
      <TouchableOpacity
        style={globalStyle.button}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={globalStyle.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};
