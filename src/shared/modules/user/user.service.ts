import { types } from "@typegoose/typegoose";
import { injectable, inject } from "inversify";
import { Component } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { UserService } from "./user-service.interface.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UserEntity } from "./user.entity.js";

@injectable()
export class BaseUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const createdUser = await this.userModel.create(user);

    this.logger.info(`User with email ${createdUser.email} was created`);

    return createdUser;
  }

  public async findById(userId: string): Promise<types.DocumentType<UserEntity> | null> {
    return await this.userModel.findById(userId);
  }

  public async findByEmail(email: string): Promise<types.DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<types.DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);

    if (user) {
      return user;
    }

    return this.create(dto, salt);
  }

  public async updateById(id: string, dto: UpdateUserDto): Promise<types.DocumentType<UserEntity> | null> {
    return await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  public async getFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel
      .findById(userId)
      .exec();

    return user?.favorites || [];
  }

  public async addOfferToFavorites(userId: string, rentId: string): Promise<unknown> {
    return this.userModel
      .findByIdAndUpdate(userId, { $push: { favorites: rentId } })
      .exec();
  }

  public async deleteOfferFromFavorites(userId: string, offerId: string): Promise<unknown> {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { favorites: offerId } })
      .exec();
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({ _id: id }));
  }
}
