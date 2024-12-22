import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./view/navigation/HomeStackNavigator";
import ProfileStackNavigator from "./view/navigation/ProfileStackNavigator";
import OrderScreen from "./view/screens/OrderScreen";
import ViewModel from "./viewModel/ViewModel";
import { use, useEffect, useState } from "react";
import { UserContextProvider } from "./view/context/UserContext";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { globalStyle } from "./styles/GlobalStyle";
import { Ionicons } from 'react-native-vector-icons';



export default function App() {

  // in order to use data in multiple screens, we need to create app context
  // create app context: user data, order data, isRegistered
  // app context provider has 4 parameters: user data initial value, order data initial value, isRegistered initial value, children
  // user data initial value, order data initial value, isRegistered initial value are created by App.js

  //FONTS LOADING
  // State per il caricamento dei font
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Carica i font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("./assets/fonts/Poppins-Black.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);


  // create ViewModel instance
  const viewModel = ViewModel.getViewModel();

  // create state: user data, order data, isRegistered
  const [userData, setUserData] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)

  // load launch data
  useEffect(() => {
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

  // Rendi il caricamento dei font
  if (!fontsLoaded) {
    return (
      <View style={globalStyle.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <UserContextProvider userDataInit={userData} orderDataInit={orderData} isRegisteredInit={isRegistered}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeStack') {
                iconName = focused ? 'home' : 'home-outline';  // Icona per la Home
              } else if (route.name === 'ProfileStack') {
                iconName = focused ? 'person' : 'person-outline';  // Icona per il Profilo
              } else if (route.name === 'Order') {
                iconName = focused ? 'cart' : 'cart-outline';  // Icona per il Carrello
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',  // Colore per la voce attiva
            tabBarInactiveTintColor: 'gray',  // Colore per la voce inattiva
            headerShown: false,  
          })}
        >
          <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
          <Tab.Screen name="Order" component={OrderScreen} options={{ title: 'Order', headerShown: true }} />
          <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );

}