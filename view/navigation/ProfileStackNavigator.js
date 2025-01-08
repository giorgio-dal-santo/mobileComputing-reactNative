import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { globalStyle } from "../../styles/GlobalStyle";

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTitleStyle: globalStyle.headerTitleStyle,
        headerTitleAlign: "center",
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </ProfileStack.Navigator>
  );
}
