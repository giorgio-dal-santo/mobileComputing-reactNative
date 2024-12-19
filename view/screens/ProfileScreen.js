import { useCallback } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRef } from "react";

export default function ProfileScreen({navigation}) {

    //instead of using state we have to use context
    const { isRegistered, userData, orderData, setOrderData } = useContext(UserContext);

    const viewModel = ViewModel.getViewModel();
    
    const fetchLastOrder = async () => {
        console.log("Executing Fetch")
        try {
            const orderDetails = await viewModel.getOrderDetail(orderData.oid);
            setOrderData(orderDetails);
            //console.log("Order Details:", orderDetails);
            //console.log("Order Data Aggiornato:", orderData);
        } catch (err) {
            console.error("Error fetching the last order details:", err);
        }
    }

    const fetchData = async () => {
        if (orderData && orderData.oid)
            await fetchLastOrder();
    };


    // Auto - Reload every 5 seconds
    const isFocused = useIsFocused(); // Tracks if the screen is currently focused
    const intervalId = useRef(null);

    useEffect(() => {
        if (isFocused) {
            console.log("Screen is focused, starting timer");
            intervalId.current = setInterval(fetchData, 5000);
        } else {
            console.log("Screen is not focused, stopping timer");
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }

        // Cleanup function to stop the timer when the component unmounts
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        };
    }, [isFocused]);


    //PER AGGIORANRE LO STATO DELL'ORDINE, MA NON FUNZIONA
    /*useEffect(() => {
            const fetchOrderStatus = async () => {
                setOrderStatus(orderData.status);
              };
              fetchOrderStatus();
    }, [orderData.status]);
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