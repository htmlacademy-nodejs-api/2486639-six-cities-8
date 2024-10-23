import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      hostId: '6715d930924dfbd3e73a0fcf' //! временно
    });
    this.created(res, fillDTO(OfferRdo, result));
  }
}
