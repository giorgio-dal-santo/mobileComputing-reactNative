import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";

//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen({ route }) {
  const { menuid, userLocation } = route.params || {};
  const viewModel = ViewModel.getViewModel();

  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    const fetchNewOrder = async () => {
      try {
        const newOrder = await viewModel.newOrder(userLocation, menuid);
        setNewOrder(newOrder);
      } catch (error) {
        console.error("Errore nel caricamento del nuovo ordine:", error);
      }
    };
    fetchNewOrder();
  }, [userLocation, menuid]);

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          <Text>Order</Text>
          {newOrder ? (
            <View>
              <Text>Oid: {newOrder.oid}</Text>
              <Text>Mid: {newOrder.mid}</Text>
              <Text>Uid: {newOrder.uid}</Text>
              <Text>creationTimestamp: {newOrder.creationTimestamp}</Text>
              <Text>status: {newOrder.status}</Text>
              <Text>deliveryLocation lat: {newOrder.deliveryLocation.lat}</Text>
              <Text>deliveryLocation lng: {newOrder.deliveryLocation.lng}</Text>
              <Text>deliveryTimestamp: {newOrder.deliveryTimestamp}</Text>
              <Text>
                expectedDeliveryTimestamp: {newOrder.expectedDeliveryTimestamp}
              </Text>
              <Text>currentPosition lat:{newOrder.currentPosition.lat}</Text>
              <Text>currentPosition lng:{newOrder.currentPosition.lng}</Text>
            </View>
          ) : (
            <Text>Caricamento in corso...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
