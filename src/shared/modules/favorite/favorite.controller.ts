import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { OfferName, OfferService, ParamOfferId } from '../offer/index.js';
import { FavoriteRoute } from './favorite.const.js';


@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    const privateRouteMiddleware = new PrivateRouteMiddleware();
    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware(OfferName.Id);
    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, OfferName.Entity, OfferName.Id);

    this.addRoute({
      path: FavoriteRoute.Root,
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [privateRouteMiddleware]
    });

    this.addRoute({
      path: FavoriteRoute.Root,
      method: HttpMethod.Post,
      handler: this.change,
      middlewares: [
        privateRouteMiddleware,
        validateObjectIdMiddleware,
        offerExistsMiddleware
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    this.favoriteService.findByUserId('asdasdsadasd');
    this.ok(res, []);
  }

  public async change({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    this.ok(res, { ...params });
  }
}
