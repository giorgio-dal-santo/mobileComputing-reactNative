import { Button, Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function MenuPreview({ menu, navigation }) {
  /*
  if (!menu.image) {
    console.log("No image found for menu:");
  } else {
    console.log("Image found for menu:");
  }
  */

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
        Consegna: {menu.deliveryTime} min
      </Text>
      <Button
        title="Menu Detail"
        onPress={() => navigation.navigate("MenuDetail")}
      />
    </View>
  );
}
