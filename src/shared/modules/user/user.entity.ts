import { defaultClasses, getModelForClass, prop, modelOptions } from "@typegoose/typegoose";
import { User, UserType } from "../../types/index.js";
import { createSHA256 } from "../../helpers/index.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: "users",
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 1, maxlength: 15, trim: true })
  public name!: string;

  @prop({ unique: true, required: true, match: /^\S+@\S+\.\S+$/, trim: true })
  public email!: string;

  @prop({ required: false, match: /\.(jpg|jpeg|png)$/ })
  public avatar?: string;

  @prop({ required: true, enum: UserType })
  public userType!: UserType;

  @prop({ required: true })
  private password?: string;

  constructor(userData: User) {
    super();

    this.userType = userData.userType;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
