import { useCallback } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useFocusEffect } from "@react-navigation/native"; 
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProfileScreen({navigation}) {

    //instead of using state we have to use context
    const { isRegistered, userData, orderData } = useContext(UserContext);

    //const [user, setUser] = useState(null);
    //const [isRegistered, setIsRegistered] = useState(null);

    /*
    const loadData = async () => {
        try {
            const viewModel = ViewModel.getViewModel();
            const user = await viewModel.loadLaunchData();
            const isRegistered = await viewModel.isRegistered();
            setIsRegistered(isRegistered);
            setUser(user);
        } catch (error) {
            console.error("Error during ViewModel initialization:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );
    */


    if (!isRegistered) {
        return (
            <View style={globalStyle.container}>
                <Text>Profile Screen</Text>
                <Text>User not registered</Text>
                <Button
                    title="Register"
                    onPress={() => navigation.navigate("EditProfile")}
                />
            </View>
        );
    }
    

    return (
        <View style={globalStyle.container}>
            <View>
            <Text>Profile Screen</Text>
            <Text>First Name: {userData.firstName}</Text>
            <Text>Last Name: {userData.lastName}</Text>
            <Text>Card Full Name: {userData.cardFullName}</Text>
            <Text>Card Number: {userData.cardNumber}</Text>
            <Text>Card Expire Month: {userData.cardExpireMonth}</Text>
            <Text>Card Expire Year: {userData.cardExpireYear}</Text>
            <Text>Card CVV: {userData.cardCVV}</Text>
            <Button
                title="Edit Profile"
                onPress={() => navigation.navigate("EditProfile")}
            />
            </View>

            <View>
                <Text>Last Order</Text>
                <Text>Order ID: {orderData.oid}</Text>
                <Text>Order Status: {orderData.status}</Text>
            </View>
        </View>
        
    );
}