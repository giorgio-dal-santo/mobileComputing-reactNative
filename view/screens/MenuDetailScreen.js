import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import { UserContext } from "../context/UserContext";
import LoadingView from "../components/LoadingView";

export default function MenuDetailScreen({ route, navigation }) {
  const { menuid } = route.params || {};

  const viewModel = ViewModel.getViewModel();
  const [detailedMenu, setDetailedMenu] = useState(null);

  const { userLocation } = useContext(UserContext);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const detailedMenu = await viewModel.getMenuDetail(
          menuid,
          userLocation.lat,
          userLocation.lng
        );
        setDetailedMenu(detailedMenu);
      } catch (error) {
        console.warn("Error during fetch menu details:", error);
      }
    };

    fetchMenuDetails();
  }, [menuid]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={globalStyle.mainContainer}>
        <View style={globalStyle.innerContainer}>{renderContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderContent() {
    if (!detailedMenu) {
      return <LoadingView />;
    }

    return (
      <View style={[globalStyle.card, { marginHorizontal: 0 }]}>
        <MenuDetailView detailedMenu={detailedMenu} />
        {userData.firstName ? (
          <UserRegisteredButtons
            detailedMenu={detailedMenu}
            navigation={navigation}
          />
        ) : (
          <UserNotRegisteredButtons navigation={navigation} />
        )}
      </View>
    );
  }
}

const MenuDetailView = ({ detailedMenu }) => {
  return (
    <View>
      <Text style={globalStyle.title}>{detailedMenu.name}</Text>
      <Image
        source={
          typeof detailedMenu.image === "string" && detailedMenu.image
            ? { uri: detailedMenu.image }
            : require("../../assets/icon.png")
        }
        style={globalStyle.imageDetail}
      />

      <Text style={globalStyle.description}>
        {detailedMenu.longDescription}
      </Text>

      <Text style={globalStyle.price}>€{detailedMenu.price.toFixed(2)}</Text>

      <Text style={[globalStyle.deliveryTime]}>
        Delivery in: {detailedMenu.deliveryTime} min
      </Text>
    </View>
  );
};

const UserRegisteredButtons = ({ detailedMenu, navigation }) => {
  return (
    <View>
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.buyButton]}
        onPress={() =>
          navigation.navigate("OrderConfirm", {
            menuid: detailedMenu.mid,
            lat: detailedMenu.location.lat,
            lng: detailedMenu.location.lng,
          })
        }
      >
        <Text style={globalStyle.buttonTextWhite}>Buy Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.goBackButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyle.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const UserNotRegisteredButtons = ({ navigation }) => {
  return (
    <View>
      <Text style={globalStyle.subTitle}>
        You need to sign up to buy this menu.
      </Text>
      <TouchableOpacity
        style={[globalStyle.button, globalStyle.signUpButton]}
        onPress={() => navigation.navigate("ProfileStack")}
      >
        <Text style={globalStyle.buttonTextWhite}>Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyle.button, globalStyle.goBackButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyle.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};
