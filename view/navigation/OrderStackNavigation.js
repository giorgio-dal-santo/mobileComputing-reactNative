import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import HomeScreen from "../screens/HomeScreen";
import OrderConfirmScreen from "../screens/OrderConfirmScreen";
import MenuDetailScreen from "../screens/MenuDetailScreen";

const OrderStack = createNativeStackNavigator();

export default function OrderStackNavigator() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen name="Order" component={OrderScreen} />
      <OrderStack.Screen name="Home" component={HomeScreen} />
      <OrderStack.Screen name="OrderConfirm" component={OrderConfirmScreen} />
      <HomeStack.Screen name="MenuDetail" component={MenuDetailScreen} />
    </OrderStack.Navigator>
  );
}