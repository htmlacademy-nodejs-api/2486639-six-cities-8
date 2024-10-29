import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { DetailOfferRdo, OfferName, OfferService, ParamOfferId } from '../offer/index.js';
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
    const middlewares = [privateRouteMiddleware, validateObjectIdMiddleware, offerExistsMiddleware];

    this.addRoute({
      path: FavoriteRoute.Root,
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [privateRouteMiddleware]
    });

    this.addRoute({
      path: FavoriteRoute.OfferId,
      method: HttpMethod.Post,
      handler: this.add,
      middlewares
    });

    this.addRoute({
      path: FavoriteRoute.OfferId,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares
    });
  }

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const favorites = await this.favoriteService.findByUserId(tokenPayload.user.id);

    this.ok(res, favorites);
  }

  public async add({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload.user;
    const favorite = await this.favoriteService.find(offerId, userId);
    const offer = await this.offerService.findById(offerId);

    if (!favorite) {
      await this.favoriteService.add(offerId, userId);
    }

    const offerRdo = fillDTO(DetailOfferRdo, offer);

    this.ok(res, { ...offerRdo, isFavorite: true });
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload.user;
    const favorite = await this.favoriteService.find(offerId, userId);
    const offer = await this.offerService.findById(offerId);

    if (favorite) {
      await this.favoriteService.deleteById(favorite.id);
    }

    const offerRdo = fillDTO(DetailOfferRdo, offer);

    this.ok(res, { ...offerRdo, isFavorite: false });
  }
}
