import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function OrderConfirmScreen({ route, navigation }) {

  const { menuid, lat, lng } = route.params || {};

  const { orderData, setOrderData, userLocation, setLastMenu, lastMenu } = useContext(UserContext);

  useEffect(() => {
    const viewModel = ViewModel.getViewModel();
    
    const fetchNewOrder = async () => {
      try {
        const newOrder = await viewModel.newOrder(userLocation, menuid, lat, lng);
        setOrderData(newOrder);
        console.log("New Order: ", newOrder);
  
        const menu = await viewModel.getMenuDetail(menuid, lat, lng);
        setLastMenu(menu);
      } catch (error) {
        console.error("Errore nel caricamento del nuovo ordine:", error);
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
        console.error("Error saving data:", error);
      }
    };
  
    if (orderData && lastMenu) {
      saveDataToStorage();
    }
  }, [orderData, lastMenu]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
          {orderData?.creationTimestamp ? (
            <View style={globalStyle.innerContainer}>
              <Text style={[globalStyle.title, { textAlign: 'center', width: '100%' }]}>
                Thank you for your purchase!
              </Text>
              <Text>MAPPA QUI (dove si trova il menu) todo</Text>
              {
                lat && lng ? (
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
                ) : (
                  <Text>Loading map...</Text>
                )
              }
              <TouchableOpacity
                style={globalStyle.button}
                onPress={() => navigation.navigate("Order")}
              >
                <Text style={globalStyle.buttonText}>Go to Your Order Status</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
