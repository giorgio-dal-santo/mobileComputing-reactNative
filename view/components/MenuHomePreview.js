import { Button, Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { TouchableOpacity } from "react-native";

export default function MenuHomePreview({ userLocation, menu, navigation }) {
  //const { menu, userLocation} = route.params || {};

  return (
    <View style={globalStyle.card}>
      <Image
        source={
          typeof menu.image === "string" && menu.image
            ? { uri: menu.image }
            : require("../../assets/icon.png")
        }
        style={globalStyle.image}
      />
      <Text style={globalStyle.title}>{menu.name}</Text>
      <Text style={globalStyle.price}>€{menu.price.toFixed(2)}</Text>
      <Text style={globalStyle.description}>{menu.shortDescription}</Text>
      <Text style={globalStyle.deliveryTime}>
        Delivery in : {menu.deliveryTime} min
      </Text>
      <TouchableOpacity
        style={globalStyle.button}
        onPress={() => navigation.navigate("MenuDetail", { menuid: menu.mid, lat: menu.location.lat, lng: menu.location.lng, userLocation: userLocation })}
      >
        <Text style={globalStyle.buttonText}>Menu Detail</Text>
      </TouchableOpacity>
      
    </View>
  );
}
