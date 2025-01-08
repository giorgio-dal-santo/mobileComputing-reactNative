import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MenuDetailScreen from "../screens/MenuDetailScreen";
import OrderConfirmScreen from "../screens/OrderConfirmScreen";
import { globalStyle } from "../../styles/GlobalStyle";

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleStyle: globalStyle.headerTitleStyle,
        headerTitleAlign: "center",
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="MenuDetail"
        component={MenuDetailScreen}
        options={{ title: "Menu Detail" }}
      />
      <HomeStack.Screen
        name="OrderConfirm"
        component={OrderConfirmScreen}
        options={{ title: "Order Confirm" }}
      />
    </HomeStack.Navigator>
  );
}
