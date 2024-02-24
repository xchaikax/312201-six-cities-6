import { User } from "./user.type.js";

export type Comment = {
  text: string;
  rating: number;
  author: User
  offerId: string;
}
