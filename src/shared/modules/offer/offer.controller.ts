import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
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
    //const { count } = req.params;

    const offers = await this.offerService.find();

    this.created(res, fillDTO(OfferRdo, offers));
  }
}
