//ORDER CLASS

export default class Order {
  constructor(
    oid,
    status,
    mid = null,
    uid = null,
    creationTimestamp = null,
    deliveryLocation = null,
    deliveryTimestamp = null,
    expectedDeliveryTimestamp = null,
    currentPosition = null,
    menuLocation = null
  ) {
    {
      this.oid = oid;
      this.status = status;
      this.mid = mid;
      this.uid = uid;
      this.creationTimestamp = creationTimestamp;
      this.deliveryLocation = deliveryLocation;
      this.deliveryTimestamp = deliveryTimestamp;
      this.expectedDeliveryTimestamp = expectedDeliveryTimestamp;
      this.currentPosition = currentPosition;
      this.menuLocation = menuLocation;
    }
  }
}
