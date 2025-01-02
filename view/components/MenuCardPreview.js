import {  Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function MenuCardPreview() {

  const { lastMenu } = useContext(UserContext);

  return (
    <View style={globalStyle.card}>
      <Image
        source={
          lastMenu && typeof lastMenu.image === "string" && lastMenu.image
            ? { uri: lastMenu.image }
            : require("../../assets/icon.png")
        }
        style={globalStyle.image}
      />
      <Text style={globalStyle.title}>{lastMenu ? lastMenu.name : "Menu name is null"}</Text>
      <Text style={globalStyle.price}>€{lastMenu?.price.toFixed(2)}</Text>
      <Text style={globalStyle.description}>{lastMenu?.shortDescription}</Text>      
    </View>
  );
}
