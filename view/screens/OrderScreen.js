import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

//Visualizza l'ordine in corso o l'ultimo
export default function OrderScreen() {
    return (
        <View style={styles.container}>
            <Text>Order</Text>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });