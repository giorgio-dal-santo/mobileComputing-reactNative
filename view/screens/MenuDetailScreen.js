import { Text, View, Image } from "react-native";
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
        console.error("Errore nel caricamento dei dettagli del menu:", error);
      }
    };

    fetchMenuDetails();
  }, [menuid]);

  return (
    <View style={globalStyle.card}>
      {detailedMenu ? (
        <>
          <Image
            source={
              typeof detailedMenu.image === "string" && detailedMenu.image
                ? { uri: detailedMenu.image }
                : require("../../assets/icon.png")
            }
            style={globalStyle.image}
          />
          <Text style={globalStyle.title}>{detailedMenu.name}</Text>
          <Text style={globalStyle.price}>
            €{detailedMenu.price.toFixed(2)}
          </Text>
          <Text style={globalStyle.description}>
            {detailedMenu.longDescription}
          </Text>
          <Text style={globalStyle.deliveryTime}>
            Delivery in: {detailedMenu.deliveryTime} min
          </Text>

          <TouchableOpacity
            style={globalStyle.button}
            onPress={() =>
              navigation.navigate("OrderConfirm", {
                menuid: detailedMenu.mid,
                lat: detailedMenu.location.lat,
                lng: detailedMenu.location.lng,
              })
            }
          >
            <Text style={globalStyle.buttonText}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyle.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyle.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Se detailedMenu è null, mostriamo un messaggio di caricamento
        <Text>Loading or Menu not available...</Text>
      )}
    </View>
  );
}
