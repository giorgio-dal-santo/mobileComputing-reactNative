import { StyleSheet } from 'react-native';

export const globalStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
      },
      label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
      },
      input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 40,
      },
      errorInput: {
        borderColor: "red",
      },
      errorText: {
        color: "red",
        marginBottom: 10,
      },
});