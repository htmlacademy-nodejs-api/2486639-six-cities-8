import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './type/create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { AuthService } from '../auth/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { CreatedUserRdo } from './rdo/created-user.rdo.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';
import { LoginUserRequest } from './type/login-user-request.type.js';
import { UserName, UserRoute } from './user.const.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.addRoute({
      path: UserRoute.Root,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: UserRoute.UserAvatar,
      method: HttpMethod.Post,
      handler: this.updateAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware(UserName.Id),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), UserName.Avatar)
      ]
    });

    this.addRoute({
      path: UserRoute.Login,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: UserRoute.Login,
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });

    this.addRoute({
      path: UserRoute.Logout,
      method: HttpMethod.Delete,
      handler: this.logout
    });
  }

  public async create({ body, tokenPayload }: CreateUserRequest, res: Response): Promise<void> {
    if (tokenPayload) {
      this.throwHttpError(StatusCodes.BAD_REQUEST, 'Only unauthorized users can register!');
    }

    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      this.throwHttpError(StatusCodes.CONFLICT, `User with email "${body.email}" exists.`);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(CreatedUserRdo, result));
  }

  public async updateAvatar({ params, file }: Request, res: Response): Promise<void> {
    const { userId } = params;
    const uploadFile = { avatarPath: file?.filename };

    await this.userService.updateById(userId, uploadFile);

    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatarPath }));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const { name, email, avatarPath, type } = user;
    const token = await this.authService.authenticate(user);

    this.ok(res, fillDTO(LoggedUserRdo, { name, email, avatarPath, type, token }));
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response): Promise<void> {
    if (!tokenPayload) {
      this.send(res, StatusCodes.UNAUTHORIZED, 'Not logged');

      return;
    }

    const findedUser = await this.userService.findById(tokenPayload.user.id);

    // странный случай... токен валидный, а пользователя в БД нет... может другой ответ написать...
    if (!findedUser) {
      this.throwHttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    this.ok(res, fillDTO(UserRdo, findedUser));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    //ничего не выполняем, т.к. токен нужно забыть на клиентской стороне
    this.noContent(res);
  }
}
