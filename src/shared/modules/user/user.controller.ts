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
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './type/login-user-request.type.js';
import { UserName, UserRoute } from './user.const.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';

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
      method: HttpMethod.Patch,
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
      path: UserRoute.Logout,
      method: HttpMethod.Delete,
      handler: this.logout
    });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      this.throwHttpError(StatusCodes.CONFLICT, `User with email "${body.email}" exists.`);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async updateAvatar(req: Request/*{ params }: Request<ParamUserId>*/, res: Response): Promise<void> {
    //! временно
    //console.log(params.userId);

    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const { email } = user;
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, { email, token });

    this.ok(res, responseData);
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    this.throwHttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented');
  }
}
