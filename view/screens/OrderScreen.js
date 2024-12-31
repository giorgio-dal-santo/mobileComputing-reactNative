import { Text, View, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function OrderScreen({ navigation }) {
  const { isRegistered, orderData, setOrderData } = useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const [menu, setMenu] = useState(null);

  const isFocused = useIsFocused();
  const intervalId = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    const loadAndSyncData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        console.log("Fetching data...");
        // 1. Caricamento iniziale dei dati da AsyncStorage
        const [savedMenu, savedOrderData] =
          await viewModel.getMenuAndOrderDataFromStorage();
        if (savedMenu) setMenu(savedMenu);
        if (savedOrderData) setOrderData(savedOrderData);

        // 2. Aggiorna i dati con il fetch dal server, se necessario
        if (savedOrderData?.mid && savedOrderData?.menuLocation) {
          const fetchedMenu = await viewModel.getMenuDetail(
            savedOrderData.mid,
            savedOrderData.menuLocation.lat,
            savedOrderData.menuLocation.lng
          );
          setMenu((prevMenu) => {
            if (!prevMenu || prevMenu.mid !== fetchedMenu.mid) {
              console.log("Fetched Menu mid: ", fetchedMenu.mid);
              return fetchedMenu;
            }
            return prevMenu;
          });
        }

        if (menu && savedOrderData.oid) {
          const fetchedOrder = await viewModel.getOrderDetail(
            savedOrderData.oid,
            menu.mid,
            menu.location.lat,
            menu.location.lng
          );
          setOrderData({
            ...savedOrderData,
            ...fetchedOrder,
          });
          //console.log("Updated OrderData oid + status: ", orderData.oid, orderData.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isFetching.current = false;
      }
    };

    if (isFocused) {
      console.log("Screen order is focused");
      loadAndSyncData();
      intervalId.current = setInterval(loadAndSyncData, 5000);
    } else {
      console.log("Screen order is not focused");
      clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isFocused]);

  // Salvataggio automatico dei dati aggiornati nello Storage
  useEffect(() => {
    const saveDataToStorage = async () => {
      try {
        await viewModel.setMenuAndOrderDataToStorage(menu, orderData);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    if (menu || orderData) saveDataToStorage();
  }, [menu, orderData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={globalStyle.mainContainer}>
          {isRegistered ? (
            <OrderStatus menu={menu} navigation={navigation} />
          ) : (
            <NotRegister navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderStatus = ({ menu, navigation }) => {
  const { userData, orderData } = useContext(UserContext);

  if (!userData.lastOid && !orderData.oid) {
    return (
      <View style={globalStyle.innerContainer}>
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
    <View>
      {!orderData || !menu ? (
        <View style={globalStyle.header}>
          <Text>Loading...</Text>
        </View>
      ) : orderData?.status === "ON_DELIVERY" ? (
        <View style={globalStyle.innerContainer}>
          <View style={globalStyle.subContainer}>
            <Text style={globalStyle.title}>
              Your order will arrive at: {orderData.expectedDeliveryTimestamp}
            </Text>
            <Text style={globalStyle.title}>
              MAPPA: mostrare luogo di consegna, luogo di partenza, traiettoria
              drone
            </Text>
          </View>
          {orderData.menuLocation?.lat && orderData.menuLocation?.lng ? (
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
              <Marker
                coordinate={{
                  latitude: orderData.menuLocation.lat,
                  longitude: orderData.menuLocation.lng,
                }}
                title="Menu Location"
                description="This is the menu location"
              />
            </View>
          ) : (
            <View style={globalStyle.subContainer}>
              <Text>Loading map data...</Text>
            </View>
          )}
          <MenuCardPreview menu={menu} />
        </View>
      ) : orderData?.status === "COMPLETED" ? (
        <View style={globalStyle.innerContainer}>
          <View style={globalStyle.subContainer}>
            <Text style={globalStyle.title}>Your order has been delivered</Text>
            <Text>MAPPA con luogo di consegna</Text>
            <Text>Delivery Location</Text>
            <Text>
              delivery Latitude: {orderData.deliveryLocation.lat} - delivery
              Longitude: {orderData.deliveryLocation.lng}
            </Text>
            <Text>
              menu Latitude: {orderData.menuLocation.lat} - menu Longitude:{" "}
              {orderData.menuLocation.lng}
            </Text>
          </View>
          <View style={globalStyle.mapContainer}>
            <MapView
              style={globalStyle.map}
              initialRegion={{
                latitude: orderData.deliveryLocation.lat,
                longitude: orderData.deliveryLocation.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            />
            <Marker
              coordinate={{
                latitude: orderData.deliveryLocation.lat,
                longitude: orderData.deliveryLocation.lng,
              }}
              title="Delivery Location"
              description="This is the delivery location"
            />
          </View>
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
      ) : (
        <View style={globalStyle.header}>
          <Text>No active order</Text>
        </View>
      )}
    </View>
  );
};

const NotRegister = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>User not registered</Text>
      <TouchableOpacity
        style={[
          globalStyle.button,
          { backgroundColor: "green", borderColor: "green" },
        ]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={globalStyle.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};
