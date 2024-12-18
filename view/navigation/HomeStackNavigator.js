import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MenuDetailScreen from "../screens/MenuDetailScreen";
import OrderConfirmScreen from "../screens/OrderConfirmScreen";

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="MenuDetail" component={MenuDetailScreen} />
            <HomeStack.Screen name="OrderConfirm" component={OrderConfirmScreen} />
        </HomeStack.Navigator>
    );
}