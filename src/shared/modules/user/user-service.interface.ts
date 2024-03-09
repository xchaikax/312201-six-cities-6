import { types } from "@typegoose/typegoose";
import { UserEntity } from "./user.entity.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>>;
  exists(id: string): Promise<boolean>;
  findById(userId: string): Promise<types.DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<types.DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>>;
  updateById(id: string, dto: UpdateUserDto): Promise<types.DocumentType<UserEntity> | null>;
  getFavorites(userId: string): Promise<string[]>;
  addOfferToFavorites(userId: string, offerId: string): Promise<unknown>;
  deleteOfferFromFavorites(userId: string, offerId: string): Promise<unknown>;
}
