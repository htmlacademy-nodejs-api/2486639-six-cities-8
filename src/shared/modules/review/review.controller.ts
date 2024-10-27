import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateReviewRequest } from './type/create-review-request.type.js';
import { ReviewService } from './review-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewRdo } from './rdo/review.rdo.js';
import { OfferName, OfferRoute, OfferService } from '../offer/index.js';
import { IndexReviewsRequest } from './type/index-reviews-request.type.js';

@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware(OfferName.Id);
    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, OfferName.Entity, OfferName.Id);

    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        validateObjectIdMiddleware,
        new ValidateDtoMiddleware(CreateReviewDto),
        offerExistsMiddleware
      ]
    });
    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        validateObjectIdMiddleware,
        offerExistsMiddleware]
    });
  }

  public async create({ body, params, tokenPayload }: CreateReviewRequest, res: Response): Promise<void> {
    const result = await this.reviewService.create(body, params.offerId, tokenPayload.user.id);

    this.created(res, fillDTO(ReviewRdo, result));
  }

  public async index({ params, query }: IndexReviewsRequest, res: Response): Promise<void> {
    const reviews = await this.reviewService.findByOfferId(params.offerId, query.count);

    this.ok(res, fillDTO(ReviewRdo, reviews));
  }
}
