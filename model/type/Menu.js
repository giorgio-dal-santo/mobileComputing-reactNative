export default class Menu {
  constructor(
    mid,
    name,
    price,
    location,
    imageVersion,
    shortDescription,
    deliveryTime,
    longDescription = null,
    image = null
  ) {
    this.mid = mid;
    this.name = name;
    this.price = price;
    this.location = location;
    this.imageVersion = imageVersion;
    this.shortDescription = shortDescription;
    this.deliveryTime = deliveryTime;
    this.longDescription = longDescription;
    this.image = image;
  }
}
