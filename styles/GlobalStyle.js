import { StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
  // text
  text: {
    fontFamily: "Poppins",
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

  // form
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 40,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  errorInputContainer: {
    borderColor: "red",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    fontSize: 16,
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  // card
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

  // image
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  profileImage: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 0,
  },

  // button
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },

  // container
  mainContainer: {
    //borderWidth: 1,
    //borderColor: 'red',
    padding: 20,
  },
  header: {
    //backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    //backgroundColor: 'yellow',
  },
  subContainer: {
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 0,
    marginBottom: 20,
    justifyContent: "center",
    flex: 1,
    //backgroundColor: 'purple',
  },
  mapContainer: {
    //backgroundColor: 'orange',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    height: 300,
  },

  // map
  map: {
    width: "100%",
    height: "100%",
    marginHorizontal: 5,
  },
});
