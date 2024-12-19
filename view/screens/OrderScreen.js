import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";

//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen({ route }) {
  
  
  
  
  return (
    <SafeAreaView style={globalStyle.container}>
        <View style={globalStyle.container}>
          <Text>Order</Text>
        </View>
    </SafeAreaView>
  );
}
