export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),
  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  OfferController: Symbol.for('OfferController'),
  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),
  ReviewController: Symbol.for('ReviewController'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter')
} as const;
