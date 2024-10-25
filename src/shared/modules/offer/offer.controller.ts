import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { ParamOfferId } from './type/param-offer-id.type.js';
import { IndexOffersRequest } from './type/index-offers-request.type.js';
import { UpdateOfferRequest } from './type/update-offer-request.type.js';
import { OFFER_ID, OfferRoute } from './offer.const.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware(OFFER_ID);
    const middlewares = [validateObjectIdMiddleware];
    //new DocumentExistsMiddleware(this.offerService, 'Offer'??, 'OFFER_ID');

    this.addRoute({
      path: OfferRoute.Root,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
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
        validateObjectIdMiddleware,
        new ValidateDtoMiddleware(UpdateOfferDto)
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
      handler: this.delete, middlewares
    });
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      //hostId: '6715d930924dfbd3e73a0fcf' //! временно
    });

    this.created(res, fillDTO(DetailOfferRdo, result));
  }

  public async index({ query }: IndexOffersRequest, res: Response): Promise<void> {
    const offers = (query.isPremium)
      ? await this.offerService.findPremium()
      : await this.offerService.find(query.count);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async update({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const { offerId } = params;
    //! throw - "Cast to ObjectId failed for value \"67189abb70d1c82e25abc7b6-\" (type string) at path \"_id\" for model \"OfferEntity\""
    // null не возвращает...
    const offer = await this.offerService.updateById(offerId, body);

    if (offer) {
      this.ok(res, fillDTO(DetailOfferRdo, offer));
    } else {
      this.notFound(res, { offerId });
    }
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    //! throw - "Cast to ObjectId failed for value \"67189abb70d1c82e25abc7b6-\" (type string) at path \"_id\" for model \"OfferEntity\""
    // null не возвращает...
    const offer = await this.offerService.findById(offerId);

    if (offer) {
      this.ok(res, fillDTO(DetailOfferRdo, offer));
    } else {
      this.notFound(res, { offerId });
    }
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    //! throw - "Cast to ObjectId failed for value \"67189abb70d1c82e25abc7b6-\" (type string) at path \"_id\" for model \"OfferEntity\""
    // null не возвращает...
    const offer = await this.offerService.deleteById(offerId);

    if (offer) {
      this.noContent(res);
    } else {
      this.notFound(res, { offerId });
    }
  }
}
