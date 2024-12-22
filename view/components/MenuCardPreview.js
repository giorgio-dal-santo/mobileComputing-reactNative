import {  Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function MenuCardPreview({menu}) {

  return (
    <View style={globalStyle.card}>
      <Image
        source={
          menu && typeof menu.image === "string" && menu.image
            ? { uri: menu.image }
            : require("../../assets/icon.png")
        }
        style={globalStyle.image}
      />
      <Text style={globalStyle.title}>{menu ? menu.name : "Menu name is null"}</Text>
      <Text style={globalStyle.price}>€{menu?.price.toFixed(2)}</Text>
      <Text style={globalStyle.description}>{menu?.shortDescription}</Text>      
    </View>
  );
}
