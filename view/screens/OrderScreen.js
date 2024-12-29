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

//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen({ navigation }) {
  const { isRegistered, orderData, setOrderData } = useContext(UserContext);

  const viewModel = ViewModel.getViewModel();
  const [menu, setMenu] = useState(null);

  const fetchLastOrder = async () => {
    console.log("Executing Fetch");
    try {
      const orderDetails = await viewModel.getOrderDetail(orderData.oid);
      setOrderData(orderDetails);
      console.log("order data", orderData);
      const menu = await viewModel.getMenuDetail(
        orderData.mid,
        orderData.deliveryLocation.lat,
        orderData.deliveryLocation.lng
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

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        {isRegistered ? (
          <OrderStatus
            orderData={orderData}
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

const OrderStatus = ({ menu, orderData, navigation }) => {
  const { canUseLocation, userLocation, setUserLocation } =
    useContext(UserContext);

  const locationViewModel = LocationViewModel.getLocationViewModel();

  const handleAllowLocation = async () => {
    await locationViewModel.askForPermission();
    const userLocation = await locationViewModel.getUserLocation();
    setUserLocation(userLocation);
  };

  const render = () => {
    console.log("map render");
    console.log("userLocation", userLocation);
    if (!userLocation) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={globalStyle.mapContainer}>
        <MapView
          style={globalStyle.map}
          showsUserLocation={true}
          //onRegionChange={handleRegionChanged}
          initialRegion={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        ></MapView>
      </View>
    );
  };

  return (
    <View style={globalStyle.container}>
      {orderData.status === "ON_DELIVERY" ? (
        <View>
          <Text style={globalStyle.title}>
            Your order will arrive in: {menu?.deliveryTime} min
          </Text>
          <Text style={globalStyle.title}>MAPPA todo</Text>
          <MenuCardPreview menu={menu} />
        </View>
      ) : orderData.status === "COMPLETED" ? (
        <View>
          <Text style={globalStyle.title}>Your order has been delivered</Text>
          <Text>MAPPA</Text>
          <View style={globalStyle.container}>
            <Text>Location Information</Text>
            {canUseLocation && userLocation ? (
              <View>
                <View>
                  <Text>
                    Latitude: {userLocation.lat} - Longitude: {userLocation.lng}
                  </Text>
                </View>
                <View>{render()}</View>
                <MenuCardPreview menu={menu} />

                <TouchableOpacity
                  style={globalStyle.button}
                  onPress={() =>
                    navigation.reset({
                      index: 0, // Index of the route to reset to (0 bc is Home)
                      routes: [
                        { name: "HomeStack", params: { screen: "Home" } },
                      ],
                    })
                  }
                >
                  <Text style={globalStyle.buttonText}>Order Again</Text>
                </TouchableOpacity>
              </View>
            ) : !canUseLocation ? (
              <View>
                <Text>Location not available</Text>
                <Button title="Allow location" onPress={handleAllowLocation} />
              </View>
            ) : (
              <View>
                <Text>Loading...</Text>
              </View>
            )}
            <StatusBar style="auto" />
          </View>
        </View>
      ) : orderData.status === null ? (
        <View>
          <Text style={globalStyle.title}>No order yet</Text>

          <TouchableOpacity
            style={globalStyle.button}
            onPress={() => navigation.navigate("HomeStack")}
          >
            <Text style={globalStyle.buttonText}>Order</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>loading</Text>
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
