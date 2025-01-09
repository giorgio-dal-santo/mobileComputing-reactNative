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
        headerShown: true,
        headerStyle: {
          height: 120, // Imposta un'altezza maggiore per l'header
        },
        headerTitleAlign: "center",
      }}
      
    >
      <HomeStack.Screen name="Home" component={HomeScreen} 
      options={{title: "Best Menus Around You"}}/>
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
