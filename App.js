import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./view/navigation/HomeStackNavigator";
import ProfileStackNavigator from "./view/navigation/ProfileStackNavigator";
import OrderScreen from "./view/screens/OrderScreen";

export default function App() {

  // in order to use data in multiple screens, we need to create app context
  // create app context: user data, order data, isRegistered
  // app context provider has 4 parameters: user data initial value, order data initial value, isRegistered initial value, children
  // user data initial value, order data initial value, isRegistered initial value are created by App.js

  // create ViewModel instance

  // create state: user data, order data, isRegistered

  // load launch data

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{title: 'Home'}} />
        <Tab.Screen name="Order" component={OrderScreen} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{title: 'Profile'}} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}