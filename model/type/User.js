export default class User {
  constructor(
    firstName,
    lastName,
    cardFullName,
    cardNumber,
    cardExpireMonth,
    cardExpireYear,
    cardCVV,
    uid,
    lastOid,
    orderStatus
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.cardFullName = cardFullName;
    this.cardNumber = cardNumber;
    this.cardExpireMonth = cardExpireMonth;
    this.cardExpireYear = cardExpireYear;
    this.cardCVV = cardCVV;
    this.uid = uid;
    this.lastOid = lastOid;
    this.orderStatus = orderStatus;
  }

  validateFirstName(firstName) {
    if (!firstName) return "The first name field is required.";
    if (!/^[a-zA-Z]+$/.test(firstName))
      return "The first name must contain only letters.";
    if (firstName.length <= 0 || firstName.length > 15) {
      return "The first name must be between 1 and 15 characters.";
    }
    return null;
  }

  validateLastName(lastName) {
    if (!lastName) return "The last name field is required.";
    if (!/^[a-zA-Z]+$/.test(lastName))
      return "The last name must contain only letters.";
    if (lastName.length <= 0 || lastName.length > 15) {
      return "The last name must be between 1 and 15 characters.";
    }
    return null;
  }

  validateCardFullName(cardFullName) {
    if (!cardFullName) return "The card full name field is required.";
    if (!/^[a-zA-Z\s]+$/.test(cardFullName))
      return "The card full name must contain only letters and spaces.";
    if (cardFullName.length <= 0 || cardFullName.length > 31) {
      return "The card full name must be between 1 and 31 characters.";
    }
    return null;
  }

  validateCardNumber(cardNumber) {
    if (!cardNumber) return "The card number field is required.";
    if (!/^\d+$/.test(cardNumber)) return "The card number must be numeric.";
    if (cardNumber.length !== 16) {
      return "The card number must be 16 digits.";
    }
    return null;
  }

  validateCardExpireMonth(cardExpireMonth) {
    if (!cardExpireMonth) return "The card expire month field is required.";
    if (!/^\d+$/.test(cardExpireMonth))
      return "The card expire month must be numeric.";
    if (parseInt(cardExpireMonth) < 1 || parseInt(cardExpireMonth) > 12) {
      return "The card expire month must be between 1 and 12.";
    }
    return null;
  }

  validateCardExpireYear(cardExpireYear) {
    if (!cardExpireYear) return "The card expire year field is required.";
    if (!/^\d+$/.test(cardExpireYear))
      return "The card expire year must be numeric.";
    if (cardExpireYear.toString().length !== 4) {
      return "The card expire year must be 4 digits";
    }
    if (parseInt(cardExpireYear) < new Date().getFullYear()) {
      return "The card expire year must be greater than the current year.";
    }
    return null;
  }

  validateCardCVV(cardCVV) {
    if (!cardCVV) return "The card CVV field is required.";
    if (!/^\d+$/.test(cardCVV)) return "The card CVV must be numeric.";
    if (cardCVV.length !== 3) {
      return "The card CVV must be 3 digits.";
    }
    return null;
  }
}
