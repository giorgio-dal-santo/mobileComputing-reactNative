import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Button } from "@react-navigation/elements";
import { TouchableOpacity } from "react-native";

export default function OrderConfirmScreen({ route, navigation }) {

  const { menuid, userLocation } = route.params || {};

  const { orderData, setOrderData } = useContext(UserContext);

  useEffect(() => {
    const viewModel = ViewModel.getViewModel();
    const fetchNewOrder = async () => {
      try {
        const newOrder = await viewModel.newOrder(userLocation, menuid);
        //console.log("newOrder", newOrder);
        setOrderData(newOrder);
      } catch (error) {
        console.error("Errore nel caricamento del nuovo ordine:", error);
      }
    };
    fetchNewOrder();
  }, [userLocation, menuid])

  //console.log("order data", orderData);

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          {orderData?.creationTimestamp ? (
            <View>
              <Text style={globalStyle.title}>Thank you for your purchase!</Text>
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

              <TouchableOpacity
                style={globalStyle.button}
                onPress={() => navigation.navigate("Order")}
              >
                <Text style={globalStyle.buttonText}>Order Status</Text>
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
