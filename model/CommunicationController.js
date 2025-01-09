// COMMUNICATION CONTROLLER

export default class CommunicationController {
  // URL base per le chiamate
  static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425";

  // funzioni generiche per chiamate al server
  static async genericRequest(endpoint, verb, queryParams, bodyParams) {
    console.log("genericRequest called");
    const queryParamsFormatted = new URLSearchParams(queryParams).toString();
    const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
    console.log("sending " + verb + " request to: " + url);

    let fetchData = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (verb !== "GET") {
      fetchData.body = JSON.stringify(bodyParams);
    }

    let httpResponse = await fetch(url, fetchData);

    const status = httpResponse.status;

    console.log("Response status: " + status);

    if (httpResponse.ok) {
      if (status === 200) {
        let deserializedObject = await httpResponse.json();
        return deserializedObject;
      } else {
        return {};
      }
    } else {
      const message = await httpResponse.json();
      let error = new Error(
        message.message
      );
      throw error;
    }
  }

  static async genericGetRequest(endpoint, queryParams) {
    return await this.genericRequest(endpoint, "GET", queryParams, {});
  }

  static async genericPostRequest(endpoint, queryParams = {}, bodyParams = {}) {
    return await this.genericRequest(endpoint, "POST", queryParams, bodyParams);
  }

  static async genericPutRequest(endpoint, bodyParams) {
    return await this.genericRequest(endpoint, "PUT", {}, bodyParams);
  }

  // User data management
  static async registerUser() {
    const endpoint = "/user";
    console.log("registerUser called with endpoint: ", endpoint);
    return await this.genericPostRequest(endpoint);
  }

  static async getUserData(sid, uid) {
    const endpoint = "/user/" + uid;
    const queryParams = { sid: sid };
    return await this.genericGetRequest(endpoint, queryParams);
  }

  static async putUserData(uid, updateData) {
    const endpoint = "/user/" + uid;
    const bodyParams = { ...updateData };
    return await this.genericPutRequest(endpoint, bodyParams);
  }

  // Menu data management
  static async getNearbyMenus(lat, lng, sid) {
    const endpoint = "/menu";
    queryParams = { lat: lat, lng: lng, sid: sid };
    return await this.genericGetRequest(endpoint, queryParams);
  }

  static async getMenuImage(mid, sid) {
    const endpoint = "/menu/" + mid + "/image";
    queryParams = { sid: sid };
    return await this.genericGetRequest(endpoint, queryParams);
  }

  static async getMenuDetail(mid, lat, lng, sid) {
    const endpoint = "/menu/" + mid;
    queryParams = { lat: lat, lng: lng, sid: sid };
    return await this.genericGetRequest(endpoint, queryParams);
  }

  //Comunicare al server che abbiamo acquistato un menu
  static async buyMenu(sid, userLocation, mid) {
    const endpoint = "/menu/" + mid + "/buy";
    const bodyParams = { sid: sid, deliveryLocation: userLocation };
    const queryParams = { mid: mid };
    return await this.genericPostRequest(endpoint, queryParams, bodyParams);
  }

  //Ottenere lo stato di un ordine
  static async getOrderDetail(oid, sid) {
    const endpoint = "/order/" + oid;
    const queryParams = { oid: oid, sid: sid };
    return await this.genericGetRequest(endpoint, queryParams);
  }
}
