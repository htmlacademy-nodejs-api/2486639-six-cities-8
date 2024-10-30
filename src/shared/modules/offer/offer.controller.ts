import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { FavoriteService } from '../favorite/index.js';
import { ReviewService } from '../review/review-service.interface.js';
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
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
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
    const { count } = query;
    let limit = undefined;

    // при передачи неправильного числа RequestQuery.count содержит string, хотя указано number
    if (count) {
      limit = parseInt(count.toString(), 10);
      if (isNaN(limit) || (limit <= 0)) {
        this.send(res, StatusCodes.BAD_REQUEST, 'count must be over zero');

        return;
      }
    }

    const offers = (query.isPremium)
      ? await this.offerService.findPremium()
      : await this.offerService.find(limit);
    const favoriteIds =
      (await this.favoriteService.findByUserId(tokenPayload?.user.id))
        .map((favorite) => (favorite.offerId.toString()));

    if (favoriteIds.length) {
      offers.forEach((offer) => {
        offer.isFavorite = favoriteIds.includes(offer.id);
      });
    }

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async update({ body, params, tokenPayload }: UpdateOfferRequest, res: Response): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload.user;
    const offer = await this.offerService.updateById(offerId, body);

    if (offer) {
      if (offer.hostId.id === userId) {
        offer.isFavorite = await this.favoriteService.exists(offerId, userId);

        this.ok(res, fillDTO(DetailOfferRdo, offer));
      } else {
        this.notAllow(res, 'Offer is not yours');
      }
    } else {
      // на случай если в другой сессии кто то успел удалить предложение, после проверки наличия объекта
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
      // на случай если в другой сессии кто то успел удалить предложение, после проверки наличия объекта
      this.notFound(res, { offerId });
    }
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload.user;
    const offer = await this.offerService.findById(offerId);

    if (offer) {
      if (offer.hostId.id === userId) {
        await this.favoriteService.deleteByOfferId(offerId);
        await this.reviewService.deleteByOfferId(offerId);
        await this.offerService.deleteById(offerId);

        this.noContent(res);
      } else {
        this.notAllow(res, 'Offer is not yours');
      }
    } else {
      // на случай если в другой сессии кто то успел удалить предложение, после проверки наличия объекта
      this.notFound(res, { offerId });
    }
  }
}
