import { readFileSync } from "node:fs";
import { FileReader } from "./file-reader.interface.js";
import { City, Facility, Offer, PropertyType, User, UserType } from "../../types/index.js";

export class TSVFileReader implements FileReader {
  private rawData = "";

  constructor(
    private readonly filename: string,
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: "utf-8" });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error("File was not read");
    }

    return this.rawData
      .split("\n")
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split("\t"))
      .map(([
        title,
        description,
        postDate,
        city,
        previewImage,
        propertyImages,
        isPremium,
        isFavorite,
        rating,
        propertyType,
        roomsNumber,
        guestsNumber,
        price,
        facilities,
        user,
        commentsCount,
        location,
      ]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: City[city as keyof typeof City],
        previewImage,
        propertyImages: propertyImages.split(";"),
        isPremium: JSON.parse(isPremium),
        isFavorite: JSON.parse(isFavorite),
        rating: Number.parseFloat(rating),
        propertyType: propertyType as PropertyType,
        roomsNumber: Number.parseInt(roomsNumber, 10),
        guestsNumber: Number.parseInt(guestsNumber, 10),
        price: Number.parseInt(price, 10),
        facilities: facilities.split(";").filter(Boolean).map((facility) => facility as Facility),
        user: this.parseUser(user),
        commentsCount: Number.parseInt(commentsCount, 10),
        coordinates: this.parseCoordinates(location),
      }));
  }

  private parseUser(user: string): User {
    const [name, email, avatar, password, userType] = user.split(";");
    return { name, email, avatar, password, userType: UserType[userType as keyof typeof UserType] };
  }

  private parseCoordinates(location: string): { latitude: number, longitude: number } {
    const [latitude, longitude] = location.split(";");
    return { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) };
  }
}
