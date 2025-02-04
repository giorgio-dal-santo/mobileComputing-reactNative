import { useEffect, useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { UserContext } from "../context/UserContext";
import LoadingView from "../components/LoadingView";

export default function OrderConfirmScreen({ route, navigation }) {
  const { menuid, lat, lng } = route.params || {};

  const { orderData, setOrderData, userLocation, setLastMenu, lastMenu } =
    useContext(UserContext);

  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const viewModel = ViewModel.getViewModel();

    const fetchNewOrder = async () => {
      try {
        const newOrder = await viewModel.newOrder(
          userLocation,
          menuid,
          lat,
          lng
        );
        setOrderData(newOrder);
        console.log("New Order: ", newOrder);

        const menu = await viewModel.getMenuDetail(menuid, lat, lng);
        setLastMenu(menu);
      } catch (error) {
        console.warn("Error during fetch new order:", error);
        setOrderError(error.message);
      }
    };

    fetchNewOrder();
  }, [userLocation, menuid]);

  useEffect(() => {
    const viewModel = ViewModel.getViewModel();

    const saveDataToStorage = async () => {
      try {
        await viewModel.setMenuAndOrderDataToStorage(lastMenu, orderData);
        console.log("Data successfully saved to storage.");
      } catch (error) {
        console.warn("Error saving data:", error);
      }
    };

    if (orderData && lastMenu) {
      saveDataToStorage();
    }
  }, [orderData, lastMenu]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );

  function renderContent() {
    if (!orderData || !orderData.creationTimestamp) {
      return <LoadingView />;
    }

    if (orderError) {
      return (
        <View style={globalStyle.innerContainer}>
          <Text style={globalStyle.subTitle}>Error: {orderError}</Text>
          <TouchableOpacity
            style={[globalStyle.button, globalStyle.goBackButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyle.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <OrderConfirmView lat={lat} lng={lng} navigation={navigation} />;
  }
}

const OrderConfirmView = ({ lat, lng, navigation }) => {
  return (
    <View style={globalStyle.innerContainer}>
      <Text style={[globalStyle.title, { textAlign: "center", width: "100%" }]}>
        Thank you for your purchase!
      </Text>

      <View style={globalStyle.mapContainer}>
        <MapView
          style={globalStyle.map}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            title="Menu Location"
          />
        </MapView>
      </View>

      <TouchableOpacity
        style={[globalStyle.button, globalStyle.enableLocationButton]}
        onPress={() => navigation.navigate("Order")}
      >
        <Text style={globalStyle.buttonTextWhite}>Go to Your Order Status</Text>
      </TouchableOpacity>
    </View>
  );
};
