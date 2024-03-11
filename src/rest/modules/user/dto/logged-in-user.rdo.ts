import { Expose } from "class-transformer";

export class LoggedInUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
}
