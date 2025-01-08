import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

export default function ProfileScreen({ navigation }) {
  const { isRegistered, userData, orderData } = useContext(UserContext);

  if (!isRegistered) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={globalStyle.mainContainer}>
          <NotRegister navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        <View style={globalStyle.profileContainer}>
          <View style={globalStyle.profileImage}>
            <Ionicons name="person-circle-outline" size={70} color="#444" />
          </View>

          <Text style={globalStyle.profileName}>
            {userData.firstName} {userData.lastName}
          </Text>

          <View style={globalStyle.profileDetails}>
            <Text style={globalStyle.profileDetailText}>
              Card Full Name: {userData.cardFullName}
            </Text>
            <Text style={globalStyle.profileDetailText}>
              Card Number: **** **** **** {userData.cardNumber.slice(-4)}
            </Text>
            <Text style={globalStyle.profileDetailText}>
              Expire Date: {userData.cardExpireMonth}/{userData.cardExpireYear}
            </Text>
            <Text style={globalStyle.profileDetailText}>CVV: ***</Text>

            <TouchableOpacity
              style={globalStyle.button}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={globalStyle.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {userData?.lastOid || orderData.oid ? (
          <View style={globalStyle.innerContainer}>
            <Text style={[globalStyle.title, { marginLeft: 20 }]}>
              Last Order:{" "}
            </Text>
            <MenuCardPreview />
          </View>
        ) : !userData.lastOid && !orderData.oid ? (
          <View style={globalStyle.innerContainer}>
            <Text style={[globalStyle.title, { marginLeft: 20 }]}>
              No order yet
            </Text>
            <TouchableOpacity
              style={globalStyle.button}
              onPress={() => navigation.navigate("HomeStack")}
            >
              <Text style={globalStyle.buttonText}>Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const NotRegister = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.title}>Complete Your Profile</Text>
      <Text style={globalStyle.subTitle}>
      To access your profile and manage your orders, please sign up.
      </Text>
      <TouchableOpacity
        style={[globalStyle.button]}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={globalStyle.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};
