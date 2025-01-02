import { Text, View, Button, TextInput } from "react-native";
import { globalStyle } from "../../styles/GlobalStyle";
import { useContext, useState } from "react";
import ViewModel from "../../viewModel/ViewModel";
import User from "../../model/type/User";
import { UserContext } from "../context/UserContext";
import { TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importa il Picker
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

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
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 0 }}>
      <ScrollView>
        <View style={globalStyle.mainContainer}>
          <Text style={globalStyle.title}>
            {isRegistered ? "Your Profile:" : "New Profile"}
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
          <View
            style={[
              globalStyle.inputContainer,
              errors.cardExpireMonth ? globalStyle.errorInputContainer : null, // Contenitore errore
            ]}
          >
            <Picker
              selectedValue={userData?.cardExpireMonth}
              onValueChange={(itemValue) =>
                updateUserField("cardExpireMonth", itemValue)
              }
              style={[
                globalStyle.picker, // Stile personalizzato per il Picker
                errors.cardExpireMonth ? globalStyle.errorInput : null, // Applicare stile errore se necessario
              ]}
            >
              <Picker.Item label="Select Month" value="" />
              <Picker.Item label="1" value="01" />
              <Picker.Item label="2" value="02" />
              <Picker.Item label="3" value="03" />
              <Picker.Item label="4" value="04" />
              <Picker.Item label="5" value="05" />
              <Picker.Item label="6" value="06" />
              <Picker.Item label="7" value="07" />
              <Picker.Item label="8" value="08" />
              <Picker.Item label="9" value="09" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
              <Picker.Item label="12" value="12" />
            </Picker>
          </View>
          {errors.cardExpireMonth ? (
            <Text style={globalStyle.errorText}>{errors.cardExpireMonth}</Text>
          ) : null}

          <Text style={globalStyle.label}>Card Expire Year</Text>
          <View
            style={[
              globalStyle.inputContainer,
              errors.cardExpireYear ? globalStyle.errorInputContainer : null, // Contenitore errore
            ]}
          >
            <Picker
              selectedValue={userData?.cardExpireYear}
              onValueChange={(itemValue) =>
                updateUserField("cardExpireYear", itemValue)
              }
              style={[
                globalStyle.picker, // Stile personalizzato per il Picker
                errors.cardExpireYear ? globalStyle.errorInput : null, // Applicare stile errore se necessario
              ]}
            >
              <Picker.Item label="Select Year" value="" />
              {/* Aggiungi gli anni disponibili */}
              {Array.from(new Array(20), (x, i) => {
                const year = new Date().getFullYear() + i; // Anni da oggi in avanti
                return (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year.toString()}
                  />
                );
              })}
            </Picker>
          </View>
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
            style={[
              globalStyle.button,
            ]}
            onPress={handleSubmit}
          >
            <Text style={globalStyle.buttonText}>
              {isRegistered ? "Save" : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
