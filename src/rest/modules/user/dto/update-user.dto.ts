import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserType } from "../../../../shared/types/index.js";
import { UserDtoMessages } from "./user-dto.messages.js";
import { UserDtoConstants } from "./user-dto.constants.js";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: UserDtoMessages.name.invalidFormat })
  @MinLength(UserDtoConstants.MIN_NAME_LENGTH, { message: UserDtoMessages.name.minLength })
  @MaxLength(UserDtoConstants.MAX_NAME_LENGTH, { message: UserDtoMessages.name.maxLength })
  public name?: string;

  @IsOptional()
  @IsEmail({}, { message: UserDtoMessages.email.invalidFormat })
  public email?: string;

  @IsOptional()
  @IsString({ message: UserDtoMessages.avatar.invalidFormat })
  public avatar?: string;

  @IsOptional()
  @IsString({ message: UserDtoMessages.password.invalidFormat })
  @MinLength(UserDtoConstants.MIN_PASSWORD_LENGTH, { message: UserDtoMessages.password.minLength })
  @MaxLength(UserDtoConstants.MAX_PASSWORD_LENGTH, { message: UserDtoMessages.password.maxLength })
  public password?: string;

  @IsOptional()
  @IsEnum(UserType, { message: UserDtoMessages.userType.invalidFormat })
  public userType?: UserType;
}
