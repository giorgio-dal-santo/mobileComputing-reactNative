//ORDER CLASS

export default class Order {
    constructor(oid, mid, uid, creationTimeStamp, status, deliveryLocation, deliveryTimestamp, expectedDeliveryTimestamp, currentPosition){ 
        {
            this.oid = oid;
            this.mid = mid;
            this.uid = uid;
            this.creationTimeStamp = creationTimeStamp;
            this.status = status;   
            this.deliveryLocation = deliveryLocation;
            this.deliveryTimestamp = deliveryTimestamp;
            this.expectedDeliveryTimestamp = expectedDeliveryTimestamp;
            this.currentPosition = currentPosition;
        }
    }
}