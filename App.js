import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import * as Font from "expo-font";
import HomeStackNavigator from "./view/navigation/HomeStackNavigator";
import ProfileStackNavigator from "./view/navigation/ProfileStackNavigator";
import OrderScreen from "./view/screens/OrderScreen";
import ViewModel from "./viewModel/ViewModel";
import { UserContextProvider } from "./view/context/UserContext";
import { globalStyle } from "./styles/GlobalStyle";
import LocationViewModel from "./viewModel/LocationViewModel";
import { PaperProvider } from "react-native-paper";

const navigationRef = React.createRef();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        PoppinsBlack: require("./assets/fonts/Poppins-Black.ttf"),
        PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
        PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const viewModel = ViewModel.getViewModel();
  const locationViewModel = LocationViewModel.getLocationViewModel();

  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [canUseLocation, setCanUseLocation] = useState(false);
  const [lastMenu, setLastMenu] = useState(null);

  useEffect(() => {
    const loadLaunchData = async () => {
      try {
        // load user data
        const [userData, orderData, isRegistered] =
          await viewModel.loadLaunchData();
        setUserData(userData);
        setOrderData(orderData);
        setIsRegistered(isRegistered);

        // load location data
        const canUseLocation = await locationViewModel.getPermission();
        setCanUseLocation(canUseLocation);

        if (canUseLocation.status === "granted") {
          locationViewModel.startWatchingLocation(
            (location) => {
              setUserLocation(location);
              console.log("User location App: ", location);
            },
            (error) => {
              console.warn("Error while watching location: ", error);
            }
          );
        }

        // load last menu
        const lastMenu = await viewModel.getLastMenu();
        setLastMenu(lastMenu);
      } catch (error) {
        console.warn("Error loading launch data: ", error);
      }
    };

    loadLaunchData();

    return () => {
      locationViewModel.stopWatchingLocation();
    };
  }, []);

  const Tab = createBottomTabNavigator();

  if (!fontsLoaded) {
    return (
      <View style={globalStyle.mainContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <UserContextProvider
        userDataInit={userData}
        orderDataInit={orderData}
        isRegisteredInit={isRegistered}
        canUseLocationInit={canUseLocation}
        userLocationInit={userLocation}
        lastMenuInit={lastMenu}
      >
        <NavigationContainer
          ref={navigationRef}
          onStateChange={async () => {
            const route = await navigationRef.current?.getCurrentRoute();
            console.log("Current route: ", route);
            if (route) await viewModel.setCurrentScreen(route);
          }}
        >
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "HomeStack") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "ProfileStack") {
                  iconName = focused ? "person" : "person-outline";
                } else if (route.name === "Order") {
                  iconName = focused ? "cart" : "cart-outline";
                }

                const iconSize = focused ? size + 5 : size + 5;

                return <Ionicons name={iconName} size={iconSize} color={color} />;
              },
              tabBarShowLabel: false,
              tabBarActiveTintColor: "black",
              tabBarInactiveTintColor: "gray",
              headerTitleStyle: globalStyle.headerTitleStyle,
              tabBarIconStyle: { alignSelf: "center", marginTop: 10 },
              tabBarStyle: { height: 60 },
            })}
          >
            <Tab.Screen
              name="HomeStack"
              component={HomeStackNavigator}
              options={{
                title: "Mangia e Basta",
              }}
            />
            <Tab.Screen
              name="Order"
              component={OrderScreen}
              options={{
                title: "Order",
              }}
            />
            <Tab.Screen
              name="ProfileStack"
              component={ProfileStackNavigator}
              options={{ title: "Profile" }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </UserContextProvider>
    </PaperProvider>
  );
}
