import { useCallback } from "react";
import ViewModel from "../../viewModel/ViewModel";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({navigation}) {
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(null);

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


    if (!isRegistered) {
        return (
            <View style={globalStyle.container}>
                <Text>Profile Screen</Text>
                <Text>User not registered</Text>
                <Button
                    title="Register"
                    onPress={() => navigation.navigate("EditProfile", {userData: user, isRegistered: isRegistered})}
                />
            </View>
        );
    }
    

    return (
        <View style={globalStyle.container}>
            <Text>Profile Screen</Text>
            <Text>First Name: {user.firstName}</Text>
            <Text>Last Name: {user.lastName}</Text>
            <Text>Card Full Name: {user.cardFullName}</Text>
            <Text>Card Number: {user.cardNumber}</Text>
            <Text>Card Expire Month: {user.cardExpireMonth}</Text>
            <Text>Card Expire Year: {user.cardExpireYear}</Text>
            <Text>Card CVV: {user.cardCVV}</Text>
            <Button
                title="Edit Profile"
                onPress={() => navigation.navigate("EditProfile", {userData: user, isRegistered: isRegistered})}
            />
        </View>
    );
}