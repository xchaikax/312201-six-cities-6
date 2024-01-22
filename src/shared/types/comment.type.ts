import { User } from "./user.type.js";

export type Comment = {
  text: string;
  date: string;
  rating: number;
  author: User
}
