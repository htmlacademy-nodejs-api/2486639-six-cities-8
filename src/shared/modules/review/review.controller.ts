import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateReviewRequest } from './type/create-review-request.type.js';
import { ReviewService } from './review-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { ReviewRdo } from './rdo/review.rdo.js';
import { OFFER_ID, OfferRoute } from '../offer/index.js';
import { IndexReviewsRequest } from './type/index-reviews-request.type.js';

@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
  ) {
    super(logger);

    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware(OFFER_ID);
    const middlewares = [validateObjectIdMiddleware];

    //! может свой Route? а там выйти на те константы...
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Post, handler: this.create, middlewares });
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Get, handler: this.index, middlewares });
  }

  public async create({ body, params }: CreateReviewRequest, res: Response): Promise<void> {
    body.offerId = params.offerId;
    body.userId = '6715d930924dfbd3e73a0fcf';

    const result = await this.reviewService.create(body);

    this.created(res, fillDTO(ReviewRdo, result));
  }

  public async index({ params, query }: IndexReviewsRequest, res: Response): Promise<void> {
    const reviews = await this.reviewService.findByOfferId(params.offerId, query.count);

    this.ok(res, fillDTO(ReviewRdo, reviews));
  }
}
