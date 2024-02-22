import dayjs from "dayjs";
import { OfferGenerator } from "./offer-generator.interface.js";
import { MockServerData } from "../../types/index.js";
import { generateRandomValue, getRandomItem, getRandomItems } from "../../helpers/index.js";

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const cityData = getRandomItem(this.mockData.cities);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), "day")
      .toISOString();
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = cityData.name;
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItem(this.mockData.images).join(";");
    const isPremium = Boolean(generateRandomValue(0, 1)).toString();
    const propertyType = getRandomItem(this.mockData.propertyTypes);
    const roomsNumber = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestsNumber = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItems(this.mockData.facilities).join(";");
    const user = Object.values(getRandomItem(this.mockData.users)).join(";");
    const location = Object.values(cityData.coordinates).join(";");

    return [
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
      location,
    ].join("\t");
  }
}
