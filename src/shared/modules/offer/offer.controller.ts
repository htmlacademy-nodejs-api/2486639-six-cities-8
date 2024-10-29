import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { FavoriteService } from '../favorite/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { ParamOfferId } from './type/param-offer-id.type.js';
import { IndexOffersRequest } from './type/index-offers-request.type.js';
import { UpdateOfferRequest } from './type/update-offer-request.type.js';
import { OfferName, OfferRoute } from './offer.const.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService
  ) {
    super(logger);

    const privateRouteMiddleware = new PrivateRouteMiddleware();
    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware(OfferName.Id);
    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, OfferName.Entity, OfferName.Id);
    const middlewares = [validateObjectIdMiddleware, offerExistsMiddleware];

    this.addRoute({
      path: OfferRoute.Root,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        privateRouteMiddleware,
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({
      path: OfferRoute.Root,
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        privateRouteMiddleware,
        validateObjectIdMiddleware,
        new ValidateDtoMiddleware(UpdateOfferDto),
        offerExistsMiddleware
      ]
    });

    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares
    });

    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        privateRouteMiddleware,
        validateObjectIdMiddleware,
        offerExistsMiddleware
      ]
    });
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body, tokenPayload.user.id);

    this.created(res, fillDTO(DetailOfferRdo, result));
  }

  public async index({ query, tokenPayload }: IndexOffersRequest, res: Response): Promise<void> {
    const offers = (query.isPremium)
      ? await this.offerService.findPremium()
      : await this.offerService.find(query.count);
    const favorites = await this.favoriteService.findByUserId(tokenPayload?.user.id);
    if (favorites) {
      offers.forEach((offer) => {
        offer.isFavorite = !!favorites.find((favorite) => (favorite.offerId.id === offer.id));
      });
    }

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async update({ body, params, tokenPayload }: UpdateOfferRequest, res: Response): Promise<void> {
    //! наверное нужно проверить что предложение этого пользователя
    const { offerId } = params;
    const offer = await this.offerService.updateById(offerId, body);

    if (offer) {
      offer.isFavorite = await this.favoriteService.exists(offerId, tokenPayload?.user.id);
      this.ok(res, fillDTO(DetailOfferRdo, offer));
    } else {
      this.notFound(res, { offerId });
    }
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (offer) {
      offer.isFavorite = await this.favoriteService.exists(offerId, tokenPayload?.user.id);
      this.ok(res, fillDTO(DetailOfferRdo, offer));
    } else {
      this.notFound(res, { offerId });
    }
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    //! наверное нужно проверить что предложение этого пользователя
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (offer) {
      this.noContent(res);
    } else {
      this.notFound(res, { offerId });
    }
  }
}
