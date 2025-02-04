import { useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { globalStyle } from "../../styles/GlobalStyle";
import { UserContext } from "../context/UserContext";
import MenuCardPreview from "../components/MenuCardPreview";

export default function ProfileScreen({ navigation }) {
  const { isRegistered, userData, orderData } = useContext(UserContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );

  function renderContent() {
    if (!isRegistered) {
      return <NotRegister navigation={navigation} />;
    }

    return (
      <RegisteredUser
        navigation={navigation}
        userData={userData}
        orderData={orderData}
      />
    );
  }
}

const NotRegister = ({ navigation }) => {
  return (
    <View style={globalStyle.innerContainer}>
      <Text style={globalStyle.title}>Complete Your Profile</Text>
      <Text style={globalStyle.subTitle}>
        To access your profile and manage your orders, please sign up.
      </Text>
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.signUpButton]}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={globalStyle.buttonTextWhite}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisteredUser = ({ navigation, userData, orderData }) => {
  return (
    <View>
      <View style={globalStyle.profileContainer}>
        <View style={globalStyle.profileImage}>
          <Ionicons name="person-circle-outline" size={70} color="#444" />
        </View>

        <Text style={globalStyle.profileName}>
          {userData.firstName} {userData.lastName}
        </Text>

        <View style={globalStyle.profileDetails}>
          <View style={globalStyle.profileDetailRow}>
            <Text style={globalStyle.profileDetailTitle}>Card Full Name: </Text>
            <Text style={globalStyle.profileDetailText}>
              {userData.cardFullName}
            </Text>
          </View>
          <View style={globalStyle.profileDetailRow}>
            <Text style={globalStyle.profileDetailTitle}>Card Number: </Text>
            <Text style={globalStyle.profileDetailText}>
              **** **** **** {userData.cardNumber.slice(-4)}
            </Text>
          </View>
          <View style={globalStyle.profileDetailRow}>
            <Text style={globalStyle.profileDetailTitle}>Expire Date: </Text>
            <Text style={globalStyle.profileDetailText}>
              {userData.cardExpireMonth}/{userData.cardExpireYear}
            </Text>
          </View>
          <View style={globalStyle.profileDetailRow}>
            <Text style={globalStyle.profileDetailTitle}>CVV: </Text>
            <Text style={globalStyle.profileDetailText}>***</Text>
          </View>

          <TouchableOpacity
            style={[globalStyle.button, globalStyle.editButton]}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={globalStyle.buttonTextWhite}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {userData?.lastOid || orderData.oid ? (
        <View style={globalStyle.innerContainer}>
          <Text style={[globalStyle.title, { marginBottom: 0 }]}>
            Last Order:{" "}
          </Text>
          <MenuCardPreview />
        </View>
      ) : !userData.lastOid && !orderData.oid ? (
        <View style={globalStyle.innerContainer}>
          <Text style={[globalStyle.subTitle, { textAlign: "center" }]}>
            It seems like you haven’t placed any orders yet.
          </Text>
          <TouchableOpacity
            style={[globalStyle.button, globalStyle.orderButton]}
            onPress={() => navigation.navigate("HomeStack")}
          >
            <Text style={globalStyle.buttonTextWhite}>Order Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};
