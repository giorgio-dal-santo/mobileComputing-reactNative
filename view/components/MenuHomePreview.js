import { Button, Text, View, Image } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function MenuPreview({ menu }) {
    return (
        <View style={globalStyle.card}>
            <Image source={{ uri: menu.image }} style={globalStyle.image} />
            <Text style={globalStyle.title}>{menu.name}</Text>
            <Text style={globalStyle.price}>€{menu.price.toFixed(2)}</Text>
            <Text style={globalStyle.description}>{menu.shortDescription}</Text>
            <Text style={globalStyle.deliveryTime}>Consegna: {menu.deliveryTime} min</Text>
        </View>
    );
}
