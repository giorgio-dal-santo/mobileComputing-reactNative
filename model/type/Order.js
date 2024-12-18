//ORDER CLASS

export default class Order {
    constructor(oid, mid, uid, creationTimestamp, status, deliveryLocation, deliveryTimestamp, expectedDeliveryTimestamp, currentPosition){ 
        {
            this.oid = oid;
            this.mid = mid;
            this.uid = uid;
            this.creationTimestamp = creationTimestamp;
            this.status = status;   
            this.deliveryLocation = deliveryLocation;
            this.deliveryTimestamp = deliveryTimestamp;
            this.expectedDeliveryTimestamp = expectedDeliveryTimestamp;
            this.currentPosition = currentPosition;
        }
    }
}