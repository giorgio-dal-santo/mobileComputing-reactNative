import { Text, View, Image, ScrollView, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { TouchableOpacity } from "react-native";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function MenuDetailScreen({ route, navigation }) {
  const { menuid } = route.params || {};

  const viewModel = ViewModel.getViewModel();
  const [detailedMenu, setDetailedMenu] = useState(null);

  const { userLocation } = useContext(UserContext);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const detailedMenu = await viewModel.getMenuDetail(
          menuid,
          userLocation.lat,
          userLocation.lng
        );
        setDetailedMenu(detailedMenu);
        console.log(
          "Dettagli del menu:",
          detailedMenu.mid,
          detailedMenu.location,
          detailedMenu.name,
          detailedMenu.deliveryTime
        );
      } catch (error) {
        console.warn("Errore nel caricamento dei dettagli del menu:", error);
      }
    };

    fetchMenuDetails();
  }, [menuid]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={globalStyle.mainContainer}>
        <View style={globalStyle.innerContainer}>
          <View style={[globalStyle.card, { marginHorizontal: 0 }]}>
            {detailedMenu ? (
              <>
                <Text style={globalStyle.title}>{detailedMenu.name}</Text>
                <Image
                  source={
                    typeof detailedMenu.image === "string" && detailedMenu.image
                      ? { uri: detailedMenu.image }
                      : require("../../assets/icon.png")
                  }
                  style={globalStyle.imageDetail}
                />

                <Text style={globalStyle.description}>
                  {detailedMenu.longDescription}
                </Text>

                <Text style={globalStyle.price}>
                  €{detailedMenu.price.toFixed(2)}
                </Text>

                <Text style={[globalStyle.deliveryTime]}>
                  Delivery in: {detailedMenu.deliveryTime} min
                </Text>

                {userData.firstName ? (
                  <View>
                    <TouchableOpacity
                      style={[globalStyle.button, globalStyle.buyButton]}
                      onPress={() =>
                        navigation.navigate("OrderConfirm", {
                          menuid: detailedMenu.mid,
                          lat: detailedMenu.location.lat,
                          lng: detailedMenu.location.lng,
                        })
                      }
                    >
                      <Text style={globalStyle.buttonTextWhite}>Buy Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[globalStyle.button, globalStyle.goBackButton]}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={globalStyle.buttonText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={globalStyle.subTitle}>
                      You need to sign up to buy this menu.
                    </Text>
                    <TouchableOpacity
                      style={[globalStyle.button, globalStyle.signUpButton]}
                      onPress={() => navigation.navigate("ProfileStack")}
                    >
                      <Text style={globalStyle.buttonTextWhite}>
                        Go to Profile
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[globalStyle.button, globalStyle.goBackButton]}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={globalStyle.buttonText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View style={globalStyle.innerContainer}>
                <Text style={globalStyle.subTitle}>Loading...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
