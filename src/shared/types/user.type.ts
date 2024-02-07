import { UserType } from "./user-type.enum.js";

export type User = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  userType: UserType;
}
