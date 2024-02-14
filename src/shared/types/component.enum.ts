export const Component = {
  RestApplication: Symbol.for("RestApplication"),
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
  DatabaseClient: Symbol.for("DatabaseClient"),
  UserModel: Symbol.for("UserModel"),
  UserService: Symbol.for("UserService"),
  OfferService: Symbol.for("OfferService"),
  OfferModel: Symbol.for("OfferModel"),
} as const;