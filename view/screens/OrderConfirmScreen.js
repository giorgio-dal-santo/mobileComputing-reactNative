import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Button } from "@react-navigation/elements";
import { TouchableOpacity } from "react-native";

export default function OrderConfirmScreen({ route, navigation }) {

  const { menuid } = route.params || {}; // route is neccessary?

  const { orderData, setOrderData, userLocation } = useContext(UserContext);

  useEffect(() => {
    const viewModel = ViewModel.getViewModel();
    const fetchNewOrder = async () => {
      try {
        const newOrder = await viewModel.newOrder(userLocation, menuid);
        setOrderData(newOrder);
      } catch (error) {
        console.error("Errore nel caricamento del nuovo ordine:", error);
      }
    };
    fetchNewOrder();
  }, [userLocation, menuid])


  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          {orderData?.creationTimestamp ? (
            <View>
              <Text style={[globalStyle.title, { textAlign: 'center', width: '100%' }]}>
                Thank you for your purchase!
          
              </Text>
              <Text>MAPPA QUI (dove si trova il menu)</Text>
              {/* 
              <Text>Oid: {orderData.oid}</Text>
              <Text>Mid: {orderData.mid}</Text>
              <Text>Uid: {orderData.uid}</Text>
              <Text>creationTimestamp: {orderData.creationTimestamp}</Text>
              <Text>status: {orderData.status}</Text>
              <Text>
                deliveryLocation lat: {orderData.deliveryLocation.lat}
              </Text>
              <Text>
                deliveryLocation lng: {orderData.deliveryLocation.lng}
              </Text>
              <Text>deliveryTimestamp: {orderData.deliveryTimestamp}</Text>
              <Text>
                expectedDeliveryTimestamp: {orderData.expectedDeliveryTimestamp}
              </Text>
              <Text>currentPosition lat:{orderData.currentPosition.lat}</Text>
              <Text>currentPosition lng:{orderData.currentPosition.lng}</Text>
                */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
