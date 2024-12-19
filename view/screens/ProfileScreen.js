import { useCallback } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";

export default function ProfileScreen({navigation}) {

    //instead of using state we have to use context
    const { isRegistered, userData, orderData } = useContext(UserContext);

    const [orderStatus, setOrderStatus] = useState(null);
    
    //PER AGGIORANRE LO STATO DELL'ORDINE, MA NON FUNZIONA
    useEffect(() => {
            const fetchOrderStatus = async () => {
                setOrderStatus(orderData.status);
              };
              fetchOrderStatus();
    }, [orderData.status]);
    

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
                <Text>Order Status: {orderStatus}</Text>
            </View>
        </View>
        
    );
}