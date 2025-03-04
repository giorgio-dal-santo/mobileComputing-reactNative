import { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import ViewModel from "../../viewModel/ViewModel";
import User from "../../model/type/User";
import { UserContext } from "../context/UserContext";

export default function EditProfileScreen({ navigation }) {
  const { userData, setUserData, isRegistered, setIsRegistered } =
    useContext(UserContext);

  const [errors, setErrors] = useState({});

  const updateUserField = (fieldName, value) => {
    setUserData(
      (prevUser) =>
        new User(
          fieldName === "firstName" ? value : prevUser.firstName,
          fieldName === "lastName" ? value : prevUser.lastName,
          fieldName === "cardFullName" ? value : prevUser.cardFullName,
          fieldName === "cardNumber" ? value : prevUser.cardNumber,
          fieldName === "cardExpireMonth" ? value : prevUser.cardExpireMonth,
          fieldName === "cardExpireYear" ? value : prevUser.cardExpireYear,
          fieldName === "cardCVV" ? value : prevUser.cardCVV,
          prevUser.uid,
          prevUser.lastOid,
          prevUser.orderStatus
        )
    );
  };

  const validateField = (fieldName, value) => {
    let error = null;

    if (fieldName === "firstName") {
      error = userData.validateFirstName(value);
    } else if (fieldName === "lastName") {
      error = userData.validateLastName(value);
    } else if (fieldName === "cardFullName") {
      error = userData.validateCardFullName(value);
    } else if (fieldName === "cardNumber") {
      error = userData.validateCardNumber(value);
    } else if (fieldName === "cardExpireMonth") {
      error = userData.validateCardExpireMonth(value);
    } else if (fieldName === "cardExpireYear") {
      error = userData.validateCardExpireYear(value);
    } else if (fieldName === "cardCVV") {
      error = userData.validateCardCVV(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async () => {
    const firstNameError = userData.validateFirstName(userData?.firstName);
    const lastNameError = userData.validateLastName(userData?.lastName);
    const cardFullNameError = userData.validateCardFullName(
      userData?.cardFullName
    );
    const cardNumberError = userData.validateCardNumber(userData?.cardNumber);
    const cardExpireMonthError = userData.validateCardExpireMonth(
      userData?.cardExpireMonth
    );
    const cardExpireYearError = userData.validateCardExpireYear(
      userData?.cardExpireYear
    );
    const cardCVVError = userData.validateCardCVV(userData?.cardCVV);

    const newErrors = {
      firstName: firstNameError,
      lastName: lastNameError,
      cardFullName: cardFullNameError,
      cardNumber: cardNumberError,
      cardExpireMonth: cardExpireMonthError,
      cardExpireYear: cardExpireYearError,
      cardCVV: cardCVVError,
    };

    setErrors(newErrors);

    const viewModel = ViewModel.getViewModel();

    if (Object.values(newErrors).every((err) => err === null)) {
      await viewModel.saveUserData(userData);
      setIsRegistered(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyle.mainContainer}>
        <View style={globalStyle.innerContainer}>
          <Text style={globalStyle.title}>
            {isRegistered ? "Edit Profile" : "New Profile"}
          </Text>

          <Text style={globalStyle.label}>First Name</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.firstName ? globalStyle.errorInput : null,
            ]}
            placeholder="First Name"
            value={userData?.firstName}
            onChangeText={(text) => updateUserField("firstName", text)}
            onBlur={() => validateField("firstName", userData?.firstName)}
          />
          {errors.firstName ? (
            <Text style={globalStyle.errorText}>{errors.firstName}</Text>
          ) : null}

          <Text style={globalStyle.label}>Last Name</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.lastName ? globalStyle.errorInput : null,
            ]}
            placeholder="Last Name"
            value={userData?.lastName}
            onChangeText={(text) => updateUserField("lastName", text)}
            onBlur={() => validateField("lastName", userData?.lastName)}
          />
          {errors.lastName ? (
            <Text style={globalStyle.errorText}>{errors.lastName}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card Full Name</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.cardFullName ? globalStyle.errorInput : null,
            ]}
            placeholder="Card Full Name"
            value={userData?.cardFullName}
            onChangeText={(text) => updateUserField("cardFullName", text)}
            onBlur={() => validateField("cardFullName", userData?.cardFullName)}
          />
          {errors.cardFullName ? (
            <Text style={globalStyle.errorText}>{errors.cardFullName}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card Number</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.cardNumber ? globalStyle.errorInput : null,
            ]}
            placeholder="Card Number"
            value={userData?.cardNumber}
            onChangeText={(text) => updateUserField("cardNumber", text)}
            keyboardType="numeric"
            onBlur={() => validateField("cardNumber", userData?.cardNumber)}
          />
          {errors.cardNumber ? (
            <Text style={globalStyle.errorText}>{errors.cardNumber}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card Expire Month</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.cardExpireMonth ? globalStyle.errorInput : null,
            ]}
            placeholder="Card Expire Month"
            value={userData?.cardExpireMonth}
            onChangeText={(text) => updateUserField("cardExpireMonth", text)}
            keyboardType="numeric"
            onBlur={() =>
              validateField("cardExpireMonth", userData?.cardExpireMonth)
            }
          />
          {errors.cardExpireMonth ? (
            <Text style={globalStyle.errorText}>{errors.cardExpireMonth}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card Expire Year</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.cardExpireYear ? globalStyle.errorInput : null,
            ]}
            placeholder="Card Expire Year"
            value={userData?.cardExpireYear}
            onChangeText={(text) => updateUserField("cardExpireYear", text)}
            keyboardType="numeric"
            onBlur={() =>
              validateField("cardExpireYear", userData?.cardExpireYear)
            }
          />
          {errors.cardExpireYear ? (
            <Text style={globalStyle.errorText}>{errors.cardExpireYear}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card CVV</Text>
          <TextInput
            style={[
              globalStyle.input,
              errors.cardCVV ? globalStyle.errorInput : null,
            ]}
            placeholder="Card CVV"
            value={userData?.cardCVV}
            onChangeText={(text) => updateUserField("cardCVV", text)}
            keyboardType="numeric"
            onBlur={() => validateField("cardCVV", userData?.cardCVV)}
          />
          {errors.cardCVV ? (
            <Text style={globalStyle.errorText}>{errors.cardCVV}</Text>
          ) : null}

          <TouchableOpacity
            style={[globalStyle.button, globalStyle.registerButton]}
            onPress={handleSubmit}
          >
            <Text style={globalStyle.buttonTextWhite}>
              {isRegistered ? "Save" : "Register"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyle.button, globalStyle.goBackButton]}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Profile' }],
              });
            }}
          >
            <Text style={globalStyle.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
