import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { ReviewService } from './review-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { ReviewEntity } from './review.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { DEFAULT_REVIEW_COUNT } from './review.const.js';
import { USER_ID } from '../user/index.js';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) { }

  public async create(dto: CreateReviewDto, offerId: string): Promise<DocumentType<ReviewEntity>> {
    const result = await this.reviewModel.create({ ...dto, offerId });
    this.logger.info(`New review created: ${dto.comment}`);

    return result.populate(USER_ID);
  }

  public async findByOfferId(offerId: string, count: number = DEFAULT_REVIEW_COUNT): Promise<DocumentType<ReviewEntity>[] | null> {
    return this.reviewModel
      .find({ offerId }, {}, { limit: count })
      .populate(USER_ID)
      .sort({ publishDate: SortType.Down });
  }

  public async getRatingOfferId(offerId: string): Promise<number> {
    const reviews = await this.reviewModel.find({ offerId });
    const ratingReviews = reviews.map(({ rating }) => rating);
    const totalRating = ratingReviews.reduce((total, rating) => total + rating, 0);

    return totalRating / ratingReviews.length;
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.reviewModel
      .deleteMany({ offerId });

    return result.deletedCount;
  }
}
