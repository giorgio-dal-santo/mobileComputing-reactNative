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
  //const [isFetching, setIsFetching] = useState(false);

  /*
  const fetchLastOrder = async () => {
    try {
      if (!menu && orderData.mid && orderData.menuLocation) {
        const fetchedMenu = await viewModel.getMenuDetail(
          orderData.mid,
          orderData.menuLocation.lat,
          orderData.menuLocation.lng
        );
        setMenu(fetchedMenu);
        console.log("Fetched Menu: ", fetchedMenu.mid);
      }
      
      if (menu && orderData) {
        const fetchedOrder = await viewModel.getOrderDetail(
          orderData.oid,
          menu.mid,
          menu.location.lat,
          menu.location.lng
        );
        setLastOrder(fetchedOrder);
        console.log("Fetched Order: ", fetchedOrder);
      }
    } catch (error) {
      console.error("Error during data initialization:", error);
    }
  };

  const fetchData = async () => {
    if (isFetching) return; // Evita di fare una nuova richiesta se una è in corso
    setIsFetching(true); // Indica che una richiesta è in corso
    try {
      if (orderData && orderData.oid) {
        await fetchLastOrder();
      console.log("Fetching last order provaaaa", lastOrder);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false); // Ripristina lo stato di richiesta
    }
  };
  */

  const isFocused = useIsFocused();

  // questa non si puo fare AIUTO
  // usare intervalId 
  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Salva il callback corrente in una ref
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Imposta l'intervallo
    useEffect(() => {
      if (delay !== null) {
        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id); // Pulizia al dismount o al cambio del delay
      }
    }, [delay]);
  }

  useEffect(() => {
    if (!isFocused) return; // Interrompi se la schermata non è visibile

    const fetchAllData = async () => {
      try {
        console.log("Fetching data...");

        if (!menu && orderData?.mid && orderData?.menuLocation) {
          const fetchedMenu = await viewModel.getMenuDetail(
            orderData.mid,
            orderData.menuLocation.lat,
            orderData.menuLocation.lng
          );
          setMenu(fetchedMenu);
          console.log("Fetched Menu: ", fetchedMenu);
        }

        if (menu && orderData?.oid) {
          const fetchedOrder = await viewModel.getOrderDetail(
            orderData.oid,
            menu.mid,
            menu.location.lat,
            menu.location.lng
          );
          setOrderData({
            ...orderData,
            ...fetchedOrder,
          });
          console.log("Updated OrderData: ", fetchedOrder);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Avvia un intervallo per chiamare `fetchAllData` ogni 5000 ms
    useInterval(() => {
      if (isFocused) {
        fetchAllData();
      }
    }, 5000);

    // Nota: Non è necessario alcun cleanup qui, poiché `useInterval` gestisce gli intervalli automaticamente
  }, [isFocused, orderData, menu]);

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        {isRegistered ? (
          <OrderStatus
            //lastOrder={lastOrder}
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

/*
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
  */

const OrderStatus = ({ menu, navigation }) => {
  const { userData, orderData } = useContext(UserContext);

  if (!userData.lastOid) {
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
      {!orderData || !menu ? (
        <Text>Loading...</Text>
      ) : orderData?.status === "ON_DELIVERY" ? (
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
      ) : orderData?.status === "COMPLETED" ? (
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
                  index: 0,
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
