import { StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
  text: {
    fontFamily: 'Poppins',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 8,
    color: "#333",
    textAlign: "left",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00A86B",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    backgroundColor: "#ffffff", // white background
    borderRadius: 15,
    borderWidth: 1, // aumento lo spessore del bordo
    borderColor: "#000", // black border
    paddingVertical: 8, // riduco il padding verticale per meno margine interno
    paddingHorizontal: 20, // riduco il padding orizzontale per meno margine interno
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#000", // black text
    fontSize: 16,
    fontWeight: "500",
  },
  
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
    justifyContent: "center",
    flex: 1,
  },
  profileImage: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#333",
    marginBottom: 20,
  },
  profileDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  profileDetailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
});
