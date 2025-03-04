import { Text, View, Image, TouchableOpacity } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function MenuHomePreview({ menu, navigation }) {
  return (
    <View style={globalStyle.card}>
      <Image
        source={
          typeof menu.image === "string" && menu.image
            ? { uri: menu.image }
            : require("../../assets/icon.png")
        }
        style={globalStyle.image}
        onError={() => console.warn(`Failed to load image: ${menu.image}`)}
      />
      <Text style={globalStyle.cardTitle}>{menu.name}</Text>
      <Text style={globalStyle.description}>{menu.shortDescription}</Text>
      <Text style={globalStyle.price}>€ {menu.price.toFixed(2)}</Text>
      <Text style={globalStyle.deliveryTime}>
        Delivery in: {menu.deliveryTime} min
      </Text>

      <TouchableOpacity
        style={[globalStyle.button, globalStyle.detailButton]}
        onPress={() => navigation.navigate("MenuDetail", { menuid: menu.mid })}
      >
        <Text style={globalStyle.buttonTextBlack}>Detail</Text>
      </TouchableOpacity>
    </View>
  );
}
