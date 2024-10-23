import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateReviewRequest } from './create-review-request.type.js';
import { ReviewService } from './review-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { ReviewRdo } from './rdo/review.rdo.js';

@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
  ) {
    super(logger);

    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.index });
  }

  public async create({ body/*, params*/ }: CreateReviewRequest, res: Response): Promise<void> {
    //!const { offerId } = params;
    body.offerId = '67189b09acca7ba105c496da'; //! offerId;
    body.userId = '67189b09acca7ba105c496da';
    const result = await this.reviewService.create(body);

    this.created(res, fillDTO(ReviewRdo, result));
  }

  public async index(req: Request, res: Response): Promise<void> {
    //!const { offerId } = params;
    const offerId = '67189b09acca7ba105c496da';
    //const { count } = req.query;
    //! временно
    console.log('req.query:', req.query);

    const offers = await this.reviewService.findByOfferId(offerId);

    this.ok(res, fillDTO(ReviewRdo, offers));
  }
}
