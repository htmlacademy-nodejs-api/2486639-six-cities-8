import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:userId/avatr', method: HttpMethod.Patch, handler: this.updateAvatr });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Delete, handler: this.logout });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      this.throwHttpError(StatusCodes.CONFLICT, `User with email "${body.email}" exists.`);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async updateAvatr(_req: Request, _res: Response): Promise<void> {
    this.throwHttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented');
  }

  public async login({ body }: LoginUserRequest, _res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      this.throwHttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found.`);
    }

    this.throwHttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented');
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    this.throwHttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented');
  }
}
