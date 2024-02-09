import { types } from "@typegoose/typegoose";
import { UserEntity } from "./user.entity.js";
import { CreateUserDto } from "./dto/create-user.dto.js";

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>>;
  findById(userId: string): Promise<types.DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<types.DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>>;
}
