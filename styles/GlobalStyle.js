import { StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
  // text
  headerTitleStyle: {
    fontSize: 28,
    fontFamily: "PoppinsBlack",
    color: "#333",
    textAlign: "center",
    width: "100%",

  },
  title: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    marginBottom: 8,
    color: "#333",
    textAlign: "left",
    
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    color: "#333",
    textAlign: "left",
  },
  subTitle: {
    fontSize: 20,
    fontFamily: "PoppinsRegular",
    fontWeight: "light",
    marginBottom: 8,
    color: "#333",
    textAlign: "left",
  },
  text: {
    fontFamily: "Poppins",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00A86B",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: "#000",
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 18,
    color: "#888",
    marginBottom: 8,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
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
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileDetailTitle: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 16,
    color: "#555",
  },
  profileDetailText: {
    fontSize: 16,
    color: "#555",
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
    marginHorizontal: 5,
  },

  // image
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageDetail: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  profileImage: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 10,
  },

  // button
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 10,
    width: '50%',
    alignSelf: 'center',
  },
  enableLocationButton: {
    backgroundColor: '#4CAF50',
    width: '80%',
    paddingVertical: 14,
  },
  signUpButton: {
    backgroundColor: '#2196F3',
    width: '80%',
    paddingVertical: 14,
  },
  buyButton: {
    backgroundColor: '#FF5722',
    width: '80%',
    paddingVertical: 14,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    width: '80%',
    paddingVertical: 14,
  },
  detailButton: {
    backgroundColor: '#FFC107',
    width: '80%',
    paddingVertical: 10,
  },
  orderButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 14,
    elevation: 3,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#6C757D',
  },
  buttonTextWhite: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextBlack: {
    color: '#000000',
    fontSize: 18,
    fontWeight: "bold",
  },

  // container
  mainContainer: {
    //borderWidth: 1,
    //borderColor: 'red',
    padding: 5,
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
    padding: 15,
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
    padding: 15,

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
