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
        const message = await httpResponse.text();
        let error = new Error(
          "Error message from the server. HTTP status: " + status + " " + message
        );
        throw error;
      }
    }
  
    static async genericGetRequest(endpoint, queryParams) {
      console.log("genericGetRequest called");
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }
  
    static async genericPostRequest(endpoint) {
      console.log("genericPostRequest called");
      return await this.genericRequest(endpoint, "POST", {}, {});
    }
  
    static async genericPutRequest(endpoint, bodyParams) {
      console.log("genericPutRequest called");
      return await this.genericRequest(endpoint, "PUT", {}, bodyParams);
    }
  
    // User data management
    static async registerUser() {
      const endpoint = "/user/";
      console.log("registerUser called with endpoint: ", endpoint);
      return await this.genericPostRequest(endpoint);
    }
  
    static async getUserData(sid, uid) {
      const endpoint = "/user/" + uid;
      const queryParams = { sid: sid };
      /*console.log(
        "getUserData called with endpoint: ",
        endpoint,
        " and queryParams: ",
        queryParams
      );
      */
      return await this.genericGetRequest(endpoint, queryParams);
    }
  
    static async putUserData(uid, updateData) {
      const endpoint = "/user/" + uid;
      const bodyParams = { ...updateData };
      /*console.log(
        "putUserData called with endpoint: ",
        endpoint,
        " and bodyParams: ",
        bodyParams
      );
      */
      return await this.genericPutRequest(endpoint, bodyParams);
    }
  
    // Menu data management
    static async getNearbyMenus(lat, lng, sid) {
      const endpoint = "/menu/";
      queryParams = { lat: lat, lng: lng, sid: sid };
      /*console.log(
        "getNearbyMenus called with endpoint: ",
        endpoint,
        " and queryParams: ",
        queryParams
      );
      */
      return await this.genericGetRequest(endpoint, queryParams);
    }
  
    static async getMenuImage(mid, sid) {
      const endpoint = "/menu/" + mid + "/image";
      queryParams = { sid: sid };
      /*console.log(
        "getMenuImage called with endpoint: ",
        endpoint,
        " and queryParams: ",
        queryParams
      );*/
      return await this.genericGetRequest(endpoint, queryParams);
    }
  
    static async getMenuDetail(mid, lat, lng, sid) {
      const endpoint = "/menu/" + mid;
      queryParams = { lat: lat, lng: lng, sid: sid };
      /*console.log(
        "getMenuDetail called with endpoint: ",
        endpoint,
        " and queryParams: ",
        queryParams
      );
      */
      return await this.genericGetRequest(endpoint, queryParams);
    }
  
    //Comunicare al server che abbiamo acquistato un menu 
    static async buyMenu(sid, userLocation, mid) {
      const endpoint = "/menu/" + mid + "/buy";
      const bodyParams = {sid: sid, deliveryLocation: userLocation};
      console.log(
        "buyMenu called with endpoint: ",
        endpoint,
        " and bodyParams: ",
        bodyParams
      );
      return await this.genericPostRequest(endpoint, bodyParams);
    }


    //Ottenere lo stato di un ordine
    static async getOrderStatus(sid, oid) {
      const endpoint = "/order/" + oid;
      const queryParams = { sid: sid, oid: oid };
      console.log(
        "getOrderStatus called with endpoint: ",
        endpoint,
        " and queryParams: ",
        queryParams
      );
      return await this.genericGetRequest(endpoint, queryParams);
    }
  }
  