import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./view/navigation/HomeStackNavigator";
import ProfileStackNavigator from "./view/navigation/ProfileStackNavigator";
import OrderScreen from "./view/screens/OrderScreen";

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="Order" component={OrderScreen} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}