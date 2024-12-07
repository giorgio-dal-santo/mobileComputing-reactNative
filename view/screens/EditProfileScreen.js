import { Text, View, Button, TextInput } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useState } from "react";
import ViewModel from "../../viewModel/ViewModel";
import User from "../../model/type/User";

export default function EditProfileScreen({ route, navigation }) {
  const { userData } = route.params || {};
  const { isRegistered } = route.params || false;
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState(() => {
    return userData instanceof User
      ? userData
      : new User(
          userData.firstName,
          userData.lastName,
          userData.cardFullName,
          userData.cardNumber,
          userData.cardExpireMonth,
          userData.cardExpireYear,
          userData.cardCVV,
          userData.uid,
          userData.lastOid,
          userData.orderStatus
        );
  });

  const updateUserField = (fieldName, value) => {
    setUser((prevUser) => 
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



  const viewModel = ViewModel.getViewModel();


  const validateField = (fieldName, value) => {
    let error = null;

    if (fieldName === "firstName") {
      error = user.validateFirstName(value);
    } else if (fieldName === "lastName") {
      error = user.validateLastName(value);
    } else if (fieldName === "cardFullName") {
      error = user.validateCardFullName(value);
    } else if (fieldName === "cardNumber") {
        error = user.validateCardNumber(value);
    } else if (fieldName === "cardExpireMonth") {
        error = user.validateCardExpireMonth(value);
    } else if (fieldName === "cardExpireYear") {
        error = user.validateCardExpireYear(value);
    } else if (fieldName === "cardCVV") {   
        error = user.validateCardCVV(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async () => {
    const firstNameError = user.validateFirstName(user?.firstName);
    const lastNameError = user.validateLastName(user?.lastName);
    const cardFullNameError = user.validateCardFullName(user?.cardFullName);
    const cardNumberError = user.validateCardNumber(user?.cardNumber);
    const cardExpireMonthError = user.validateCardExpireMonth(user?.cardExpireMonth);
    const cardExpireYearError = user.validateCardExpireYear(user?.cardExpireYear);
    const cardCVVError = user.validateCardCVV(user?.cardCVV);

    const newErrors = {
        firstName: firstNameError,
        lastName: lastNameError,
        cardFullName: cardFullNameError,
        cardNumber: cardNumberError,
        cardExpireMonth: cardExpireMonthError,
        cardExpireYear: cardExpireYearError,
        cardCVV: cardCVVError
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => err === null)) {
        await viewModel.saveUserData(user);
        navigation.goBack();
    }
  };

  return (
    <View style={globalStyle.container}>
      <Text>{isRegistered ? "Your Profile" : "New Profile"}</Text>

      <Text style={globalStyle.label}>First Name</Text>
      <TextInput
        style={[globalStyle.input, errors.firstName ? globalStyle.errorInput : null]}
        placeholder="First Name"
        value={user?.firstName}
        onChangeText={(text) => updateUserField("firstName", text)}
        onBlur={() => validateField("firstName", user?.firstName)}
      />
      {errors.firstName ? <Text style={globalStyle.errorText}>{errors.firstName}</Text> : null}

      <Text style={globalStyle.label}>Last Name</Text>
      <TextInput
      style={[globalStyle.input, errors.lastName ? globalStyle.errorInput : null]}
        placeholder="Last Name"
        value={user?.lastName}
        onChangeText={(text) => updateUserField("lastName", text)}
        onBlur={() => validateField("lastName", user?.lastName)}
      />
        {errors.lastName ? <Text style={globalStyle.errorText}>{errors.lastName}</Text> : null}

      <Text style={globalStyle.label}>Card Full Name</Text>
      <TextInput
        style={[globalStyle.input, errors.cardFullName ? globalStyle.errorInput : null]}
        placeholder="Card Full Name"
        value={user?.cardFullName}
        onChangeText={(text) => updateUserField("cardFullName", text)}
        onBlur={() => validateField("cardFullName", user?.cardFullName)}
      />
        {errors.cardFullName ? <Text style={globalStyle.errorText}>{errors.cardFullName}</Text> : null}

      <Text style={globalStyle.label}>Card Number</Text>
      <TextInput
        style={[globalStyle.input, errors.cardNumber ? globalStyle.errorInput : null]}
        placeholder="Card Number"
        value={user?.cardNumber}
        onChangeText={(text) => updateUserField("cardNumber", text)}
        keyboardType="numeric"
        onBlur={() => validateField("cardNumber", user?.cardNumber)}
      />
        {errors.cardNumber ? <Text style={globalStyle.errorText}>{errors.cardNumber}</Text> : null}

      <Text style={globalStyle.label}>Card Expire Month</Text>
      <TextInput
        style={[globalStyle.input, errors.cardExpireMonth ? globalStyle.errorInput : null]}
        placeholder="Card Expire Month"
        value={user?.cardExpireMonth ? user.cardExpireMonth.toString() : ''}
        onChangeText={(text) => updateUserField("cardExpireMonth", text)}
        keyboardType="numeric"
        onBlur={() => validateField("cardExpireMonth", user?.cardExpireMonth)}
      />
        {errors.cardExpireMonth ? <Text style={globalStyle.errorText}>{errors.cardExpireMonth}</Text> : null}

      <Text style={globalStyle.label}>Card Expire Year</Text>
      <TextInput
        style={[globalStyle.input, errors.cardExpireYear ? globalStyle.errorInput : null]}
        placeholder="Card Expire Year"
        value={user?.cardExpireYear ? user.cardExpireYear.toString() : ''}
        onChangeText={(text) => updateUserField("cardExpireYear", text)}
        keyboardType="numeric"
        onBlur={() => validateField("cardExpireYear", user?.cardExpireYear)}
      />
        {errors.cardExpireYear ? <Text style={globalStyle.errorText}>{errors.cardExpireYear}</Text> : null}

      <Text style={globalStyle.label}>Card CVV</Text>
      <TextInput
        style={[globalStyle.input, errors.cardCVV ? globalStyle.errorInput : null]}
        placeholder="Card CVV"
        value={user?.cardCVV}
        onChangeText={(text) => updateUserField("cardCVV", text)}
        keyboardType="numeric"
        onBlur={() => validateField("cardCVV", user?.cardCVV)}
      />
        {errors.cardCVV ? <Text style={globalStyle.errorText}>{errors.cardCVV}</Text> : null}

      <Button
        title={isRegistered ? "Save" : "Register"}
        onPress={handleSubmit}
      />
    </View>
  );
}
