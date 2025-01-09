import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState } from "react";

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
        console.warn("Errore nel caricamento del nuovo ordine:", error);
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

  if (orderError) {
    return (
      <Text style={globalStyle.subTitle}>Error: {orderError}</Text>
    )
  }

  if (!orderData || !orderData.creationTimestamp) {
    return (
      <View style={globalStyle.innerContainer}>
        <Text style={globalStyle.subTitle}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        <View style={globalStyle.innerContainer}>

          <Text
            style={[
              globalStyle.title,
              { textAlign: "center", width: "100%" },
            ]}
          >
            Thank you for your purchase!
          </Text>

          {
          (lat && lng) 
            ? (
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
            )
            : (
              <Text>Loading map...</Text>
            )
          }
          
          <TouchableOpacity
            style={[globalStyle.button, globalStyle.enableLocationButton]}
            onPress={() => navigation.navigate("Order")}
          >
            <Text style={globalStyle.buttonTextWhite}>
              Go to Your Order Status
            </Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
