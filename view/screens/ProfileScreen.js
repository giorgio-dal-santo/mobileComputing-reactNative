import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";
import MenuCardPreview from "../components/MenuCardPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

export default function ProfileScreen({ navigation }) {
  const { isRegistered, userData, orderData, setOrderData, userLocation } =
    useContext(UserContext);

  const viewModel = ViewModel.getViewModel();

  const [menu, setMenu] = useState(null);

  const isFocused = useIsFocused();
  const intervalId = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        console.log("Fetching data...");

        if (orderData?.mid && orderData?.menuLocation) {
          const fetchedMenu = await viewModel.getMenuDetail(
            orderData.mid,
            orderData.menuLocation.lat,
            orderData.menuLocation.lng
          );
          setMenu((prevMenu) => {
            if (!prevMenu || prevMenu.mid !== fetchedMenu.mid) {
              console.log("Fetched Menu mid: ", fetchedMenu.mid);
              return fetchedMenu;
            }
            return prevMenu;
          });
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
          console.log(
            "Updated OrderData oid + status: ",
            fetchedOrder.oid,
            fetchedOrder.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isFetching.current = false;
      }
    };

    if (isFocused) {
      console.log("Screen profile is focused");
      fetchAllData();
      intervalId.current = setInterval(fetchAllData, 5000);
    } else {
      console.log("Screen profile is not focused");
      clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isFocused]);

  if (!isRegistered) {
    return (
      <View style={globalStyle.container}>
        <Text>Profile Screen</Text>
        <Text>User not registered</Text>
        <TouchableOpacity
          style={[
            globalStyle.button,
            { backgroundColor: "green", borderColor: "green" },
          ]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={[globalStyle.buttonText, { color: "#fff" }]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyle.container}>
      <ScrollView>
        <View style={globalStyle.container}>
          <View style={globalStyle.profileContainer}>
            <View style={globalStyle.profileImage}>
              <Ionicons name="person-circle-outline" size={70} color="#444" />
            </View>

            <Text style={globalStyle.profileName}>
              {userData.firstName} {userData.lastName}
            </Text>

            <View style={globalStyle.profileDetails}>
              <Text style={globalStyle.profileDetailText}>
                Card Full Name: {userData.cardFullName}
              </Text>
              <Text style={globalStyle.profileDetailText}>
                Card Number: **** **** **** {userData.cardNumber.slice(-4)}
              </Text>
              <Text style={globalStyle.profileDetailText}>
                Expire Date: {userData.cardExpireMonth}/
                {userData.cardExpireYear}
              </Text>
              <Text style={globalStyle.profileDetailText}>CVV: ***</Text>

              <TouchableOpacity
                style={globalStyle.button}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={globalStyle.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {userData?.lastOid || orderData.oid ? (
            <View style={globalStyle.container}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={[globalStyle.title, { marginLeft: 20 }]}>
                  Last Order:{" "}
                </Text>
                <TouchableOpacity
                  style={[
                    globalStyle.button,
                    {
                      paddingHorizontal: 15,
                      backgroundColor: "#fff",
                      marginRight: 20,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate("HomeStack", {
                      screen: "MenuDetail",
                      params: {
                        menuid: menu.mid,
                        lat: menu.location.lat,
                        lng: menu.location.lng,
                        userLocation: userLocation,
                      },
                    })
                  }
                >
                  <Text style={globalStyle.buttonText}>
                    Go to the Menu Details
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <MenuCardPreview menu={menu} />
              </View>
            </View>
          ) : !userData.lastOid && !orderData.oid ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={[{ marginLeft: 20 }]}>No order yet</Text>
              <Text style={[{ marginRight: 20 }]}>Order Now Bottone</Text>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
