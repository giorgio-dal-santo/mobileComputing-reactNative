import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./view/navigation/HomeStackNavigator";
import ProfileStackNavigator from "./view/navigation/ProfileStackNavigator";
import OrderScreen from "./view/screens/OrderScreen";
import ViewModel from "./viewModel/ViewModel";
import { use, useEffect, useState } from "react";
import { UserContextProvider } from "./view/context/UserContext";

export default function App() {

  // in order to use data in multiple screens, we need to create app context
  // create app context: user data, order data, isRegistered
  // app context provider has 4 parameters: user data initial value, order data initial value, isRegistered initial value, children
  // user data initial value, order data initial value, isRegistered initial value are created by App.js

  // create ViewModel instance
  const viewModel = ViewModel.getViewModel();

  // create state: user data, order data, isRegistered
  const [userData, setUserData] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)

  // load launch data
  useEffect( () => {
    const loadLaunchData = async () => {
      try {
        const [userData, orderData, isRegistered] = await viewModel.loadLaunchData();
        setUserData(userData);
        setOrderData(orderData);
        setIsRegistered(isRegistered);
      } catch (error) {
        console.error("Error loading launch data: ", error);
      }
    };

    loadLaunchData();
  }, []);


  const Tab = createBottomTabNavigator();

  return (
    <UserContextProvider userDataInit={userData} orderDataInit={orderData} isRegisteredInit={isRegistered}>
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{title: 'Home'}} />
        <Tab.Screen name="Order" component={OrderScreen} options={{title: "Order", headerShown: true}} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{title: 'Profile'}} />
      </Tab.Navigator>
    </NavigationContainer>
    </UserContextProvider>
  );

}