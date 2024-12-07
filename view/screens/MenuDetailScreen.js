import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";

export default function MenuDetailScreen({navigation}) {

    return (
        <View style={globalStyle.container}>
            <Text>Menu Detail</Text>
            <Button
                title="Back to Home"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
}