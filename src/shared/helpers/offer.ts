import { City, Facility, Offer, PropertyType, User, UserType } from "../types/index.js";

export function createOffer(data: string): Omit<Offer, "isFavorite" | "rating" | "commentsCount"> {
  const [
    createdDate,
    title,
    description,
    city,
    previewImage,
    images,
    isPremium,
    propertyType,
    roomsNumber,
    guestsNumber,
    price,
    facilities,
    user,
    coordinates,
  ] = data.replace("\n", "").split("\t");

  return {
    title,
    description,
    createdDate: new Date(createdDate),
    city: City[city as keyof typeof City],
    previewImage,
    images: images.split(";"),
    isPremium: JSON.parse(isPremium),
    propertyType: propertyType as PropertyType,
    roomsNumber: Number.parseInt(roomsNumber, 10),
    guestsNumber: Number.parseInt(guestsNumber, 10),
    price: Number.parseInt(price, 10),
    facilities: facilities.split(";").filter(Boolean).map((facility) => facility as Facility),
    author: parseUser(user),
    coordinates: parseCoordinates(coordinates),
  };
}

function parseUser(user: string): User {
  const [name, email, avatar, userType] = user.split(";");
  return { name, email, avatar, userType: userType as UserType };
}

function parseCoordinates(location: string): { latitude: number, longitude: number } {
  const [latitude, longitude] = location.split(";");
  return { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) };
}
