import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";

//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen({route}) {
    const {menuid, userLocation} = route.params || {};
    const viewModel = ViewModel.getViewModel();
    
    const [newOrder, setNewOrder] = useState(null);
    
        useEffect(() => {
            const fetchNewOrder = async () => {
                try {
                    const newOrder = await viewModel.newOrder(userLocation, menuid);
                    setNewOrder(newOrder);
                    
                } catch (error) {
                    console.error("Errore nel caricamento del nuovo ordine:", error);
                }
            };
            fetchNewOrder();
        }, [userLocation, menuid]);
    
    

    return (
        <View style={globalStyle.container}>
            <Text>Order</Text>
            
        </View>
    );
}



/*
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  */