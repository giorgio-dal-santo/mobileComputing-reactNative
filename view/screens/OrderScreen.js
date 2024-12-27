import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";





//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen({ route, navigation }) {

  const { isRegistered, userData, orderData, setOrderData } = useContext(UserContext);

  const viewModel = ViewModel.getViewModel();
  const [menu, setMenu] = useState(null);

  const fetchLastOrder = async () => {
    console.log("Executing Fetch")
    try {
      const orderDetails = await viewModel.getOrderDetail(orderData.oid);
      setOrderData(orderDetails);
      const menu = await viewModel.getMenuDetail(orderData.mid, orderData.deliveryLocation.lat, orderData.deliveryLocation.lng);
      setMenu(menu);
      //console.log("Order Details:", orderDetails);
      //console.log("Order Data Aggiornato:", orderData);
    } catch (err) {
      console.error("Error fetching the last order details:", err);
    }
  }

  const fetchData = async () => {
    if (orderData && orderData.oid)
      await fetchLastOrder();
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
          <OrderStatus orderData={orderData} menu={menu} />
        ) : (
          <NotRegister navigation={navigation} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderStatus = ({ menu, orderData }) => {

  //console.log("OrderData:", orderData);

  const navigation = useNavigation();  // Ottieni l'oggetto navigation
  return (
    <View style={globalStyle.container}>
      {(orderData.status === "ON_DELIVERY") ? (
        <View>
          <Text style={globalStyle.title}>Your order will arrive in: {menu?.deliveryTime} min</Text>

          <Text style={globalStyle.title}>MAPPA</Text>
          <MenuCardPreview menu={menu} />
        </View>
      ) : (orderData.status === "COMPLETED") ? (
        <View>
          <Text style={globalStyle.title}>Your order has been delivered</Text>
          
          
          
          <Text>MAPPA</Text>
          <View style={styles.container}>
            <Text>Location Information</Text>
            {canUseLocation && location ? (
              <View>
                <View>
                  <Text>
                    Latitude: {location.coords.latitude} - Longitude:{" "}
                    {location.coords.longitude}
                  </Text>
                </View>
                <View>{render()}</View>
              </View>
            ) : !canUseLocation ? (
              <View>
                <Text>Nessun accesso a posizione</Text>
                <Button title="Attiva posizione" onPress={startLocationUpdates} />
              </View>
            ) : (
              <Text>Caricamento...</Text>
            )}
            <StatusBar style="auto" />
          </View>



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


        </View>
      ) : (
        <View>
          <Text style={globalStyle.title}>No order yet</Text>

          <TouchableOpacity
            style={globalStyle.button}
            onPress={() => navigation.navigate("HomeStack")}
          >
            <Text style={globalStyle.buttonText}>Order</Text>
          </TouchableOpacity>
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









