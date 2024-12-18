import { Button, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";

export default function MenuDetailScreen({ route, navigation }) {
    const { menuid, lat, lng, userLocation } = route.params || {};

    const viewModel = ViewModel.getViewModel();
    const [detailedMenu, setDetailedMenu] = useState(null);

    useEffect(() => {
        // Funzione asincrona per ottenere i dettagli del menu
        const fetchMenuDetails = async () => {
            try {
                const detailedMenu = await viewModel.getMenuDetail(menuid, lat, lng);
                setDetailedMenu(detailedMenu);
            } catch (error) {
                console.error("Errore nel caricamento dei dettagli del menu:", error);
            }
        };

        fetchMenuDetails();
    }, [menuid, lat, lng]);


    return (
        <View style={globalStyle.container}>
            <Text>Menu Detail</Text>
            {detailedMenu ? ( // Verifica se detailedMenu è stato caricato
                <View>
                    <Text>{detailedMenu.name}</Text>
                    <Image
                        source={
                            typeof detailedMenu.image === "string" && detailedMenu.image
                                ? { uri: detailedMenu.image }
                                : require("../../assets/icon.png")
                        }
                        style={globalStyle.image}
                    />
                    <Text>{detailedMenu.price}</Text>
                    <Text>{detailedMenu.longDescription}</Text>
                    <Text>{detailedMenu.deliveryTime}</Text>
                </View>
            ) : (
                <Text>Caricamento in corso...</Text> // Render di fallback durante il caricamento
            )}
            <Button
                title="Buy"
                onPress={() => navigation.navigate("Order", { menuid: detailedMenu.mid, userLocation: userLocation })}
            />
            <Button
                title="Back to Home"
                onPress={() => navigation.goBack()}
            />

        </View>
    );
}
