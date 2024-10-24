import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { OFFER_ID, OfferRoute } from './offer.const.js';

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

    this.addRoute({ path: OfferRoute.Root, method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: OfferRoute.Root, method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Patch, handler: this.update, middlewares });
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Get, handler: this.show, middlewares });
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Delete, handler: this.delete, middlewares });
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      //hostId: '6715d930924dfbd3e73a0fcf' //! временно
      hostId: '671797ceed73d6ef04c13d63' //! временно
    });

    //! временно
    console.log(result);
    //! hostid, оставляет только _id
    console.log(fillDTO(DetailOfferRdo, result));

    this.created(res, fillDTO(DetailOfferRdo, result));
  }

  public async index(req: Request, res: Response): Promise<void> {
    //! временно
    console.log('req.query:', req.query);
    //const { count, premium: isPremium } = req.query;

    const offers = await this.offerService.find();
    //! premium
    //const offers = await this.offerService.findPremium();

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
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
