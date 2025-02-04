import { useEffect, useRef, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import LoadingView from "../components/LoadingView";

export default function OrderScreen({ navigation }) {
  const { isRegistered, orderData, setOrderData, lastMenu, setLastMenu } =
    useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const isFocused = useIsFocused();
  const intervalId = useRef(null);

  useEffect(() => {
    const getDataFromStorage = async () => {
      try {
        const savedMenu = await viewModel.getLastMenu();
        const savedOrderData = await viewModel.getLastOrderData();

        if (savedMenu) setLastMenu(savedMenu);
        if (savedOrderData) setOrderData(savedOrderData);
      } catch (error) {
        console.warn("Error loading data:", error);
      }
    };

    getDataFromStorage();
  }, []);

  useEffect(() => {
    const currentOrderData = async () => {
      try {
        if (orderData.oid) {
          const updatedOrderData = await viewModel.getOrderDetail(
            orderData.oid
          );
          setOrderData(updatedOrderData);
          console.log("Current position: ", updatedOrderData.currentPosition);
        }
      } catch (error) {
        console.warn("Error fetching current order:", error);
      }
    };

    const saveDataToStorage = async () => {
      try {
        if (lastMenu && orderData) {
          await viewModel.setMenuAndOrderDataToStorage(lastMenu, orderData);
        }
      } catch (error) {
        console.warn("Error saving data:", error);
      }
    };

    if (isFocused) {
      console.log("Screen order is focused");
      currentOrderData();
      intervalId.current = setInterval(currentOrderData, 5000);
    }

    return () => {
      console.log("Component unmounted or screen is no longer focused");
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      saveDataToStorage();
    };
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={globalStyle.mainContainer}>
          {isRegistered ? (
            <OrderStatus navigation={navigation} />
          ) : (
            <NotRegister navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderStatus = ({ navigation }) => {
  const { userData, orderData, lastMenu } = useContext(UserContext);

  const renderContent = () => {
    if (!userData.lastOid && !orderData.oid) {
      return <NoOrder navigation={navigation} />;
    }

    if (!orderData || !lastMenu) {
      return <LoadingView />;
    }

    if (orderData.status === "ON_DELIVERY") {
      return (
        <View>
          <DeliveryContent orderData={orderData} lastMenu={lastMenu} />
          <MenuCardPreview />
        </View>
      );
    }

    if (orderData.status === "COMPLETED") {
      return (
        <View>
          <CompletedContent orderData={orderData} navigation={navigation} />
          <MenuCardPreview />
        </View>
      );
    }
  };

  return <View style={globalStyle.innerContainer}>{renderContent()}</View>;
};

const NotRegister = ({ navigation }) => {
  return (
    <View style={globalStyle.innerContainer}>
      <Text style={globalStyle.title}>Sign Up to Start Ordering</Text>
      <Text style={globalStyle.subTitle}>
        You need to sign up to place an order. Get started and enjoy delicious
        meals delivered quickly to your location.
      </Text>
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.signUpButton]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={globalStyle.buttonTextWhite}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const NoOrder = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>No order yet</Text>
      <Text style={globalStyle.subTitle}>
        You haven’t placed any orders yet. Start by exploring the menus
        available!
      </Text>

      <TouchableOpacity
        style={[globalStyle.button, globalStyle.orderButton]}
        onPress={() => navigation.navigate("HomeStack")}
      >
        <Text style={globalStyle.buttonTextWhite}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const DeliveryContent = ({ orderData, lastMenu }) => {
  return (
    <View>
      <View style={globalStyle.subContainer}>
        <Text style={globalStyle.title}>
          Your order will arrive at:{" "}
          {new Date(orderData.expectedDeliveryTimestamp).toLocaleString(
            "it-IT",
            {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            }
          )}
        </Text>
      </View>
      {lastMenu.location?.lat && orderData?.deliveryLocation && (
        <View style={globalStyle.mapContainer}>
          <MapView
            style={globalStyle.map}
            initialRegion={{
              latitude: lastMenu.location.lat,
              longitude: lastMenu.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: lastMenu.location.lat,
                longitude: lastMenu.location.lng,
              }}
              title="Menu Location"
              description="This is the menu location"
            />
            <Marker
              coordinate={{
                latitude: orderData.deliveryLocation.lat,
                longitude: orderData.deliveryLocation.lng,
              }}
              title="Delivery Location"
              description="This is the delivery location"
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

const CompletedContent = ({ orderData, navigation }) => {
  return (
    <View>
      <View style={globalStyle.subContainer}>
        <Text style={globalStyle.title}>
          Your order has been delivered at{" "}
          {new Date(orderData.deliveryTimestamp).toLocaleString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          })}
        </Text>
      </View>
      {orderData.deliveryLocation && (
        <View style={globalStyle.mapContainer}>
          <MapView
            style={globalStyle.map}
            initialRegion={{
              latitude: orderData.deliveryLocation.lat,
              longitude: orderData.deliveryLocation.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: orderData.deliveryLocation.lat,
                longitude: orderData.deliveryLocation.lng,
              }}
              title="Delivery Location"
              description="This is the delivery location"
            />
          </MapView>
        </View>
      )}
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.orderButton]}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "HomeStack", params: { screen: "Home" } }],
          })
        }
      >
        <Text style={globalStyle.buttonTextWhite}>Order Again</Text>
      </TouchableOpacity>
    </View>
  );
};
