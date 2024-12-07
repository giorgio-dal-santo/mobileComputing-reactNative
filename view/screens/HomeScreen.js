import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function HomeScreen({navigation}) {
    return (
        <View style={globalStyle.container}>
            <Text>Home</Text>
            <Button
                title="Menu Detail"
                onPress={() => navigation.navigate("MenuDetail")}
            />
        </View>
    );
}