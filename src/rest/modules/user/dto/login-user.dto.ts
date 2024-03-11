import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { UserDtoMessages } from "./user-dto.messages.js";
import { UserDtoConstants } from "./user-dto.constants.js";

export class LoginUserDto {
  @IsEmail({}, { message: UserDtoMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserDtoMessages.password.invalidFormat })
  @MinLength(UserDtoConstants.MIN_PASSWORD_LENGTH, { message: UserDtoMessages.password.minLength })
  @MaxLength(UserDtoConstants.MAX_PASSWORD_LENGTH, { message: UserDtoMessages.password.maxLength })
  public password: string;
}
