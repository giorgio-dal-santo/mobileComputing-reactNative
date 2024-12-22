import { Button, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { TouchableOpacity } from "react-native";
import MenuCardPreview from "../components/MenuCardPreview";


export default function MenuDetailScreen({ route, navigation }) {
    const { menuid, lat, lng, userLocation } = route.params || {};

    const viewModel = ViewModel.getViewModel();
    const [detailedMenu, setDetailedMenu] = useState(null);

    useEffect(() => {
        // Funzione asincrona per ottenere i dettagli del menu
        const fetchMenuDetails = async () => {
            try {
                const detailedMenu = await viewModel.getMenuDetail(menuid, lat, lng);
                setDetailedMenu(detailedMenu);
            } catch (error) {
                console.error("Errore nel caricamento dei dettagli del menu:", error);
            }
        };

        fetchMenuDetails();
    }, [menuid, lat, lng]);


    return (
        <View style={globalStyle.card}>
          {/* Controlla se detailedMenu è null */}
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
              <Text style={globalStyle.price}>€{detailedMenu.price.toFixed(2)}</Text>
              <Text style={globalStyle.description}>{detailedMenu.shortDescription}</Text>
              <Text style={globalStyle.deliveryTime}>
                Delivery in : {detailedMenu.deliveryTime} min
              </Text>
      
              <TouchableOpacity
                style={globalStyle.button}
                onPress={() =>
                  navigation.navigate("OrderConfirm", {
                    menuid: detailedMenu.mid,
                    userLocation: userLocation,
                  })
                }
              >
                <Text style={globalStyle.buttonText}>Buy</Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                style={globalStyle.button}
                onPress={() => navigation.goBack()}
              >
                <Text style={globalStyle.buttonText}>Back to Home</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Se detailedMenu è null, mostriamo un messaggio di caricamento
            <Text>Loading or Menu not available...</Text>
          )}
        </View>
      );      
}
