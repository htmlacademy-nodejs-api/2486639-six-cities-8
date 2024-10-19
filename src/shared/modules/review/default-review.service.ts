import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { ReviewService } from './review-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { ReviewEntity } from './review.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) { }

  public async create(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>> {
    const result = await this.reviewModel.create(dto);
    this.logger.info(`New review created: ${dto.comment}`);

    return result;
  }

  public async findByofferId(offerId: string): Promise<DocumentType<ReviewEntity>[] | null> {
    return this.reviewModel.find({ offerId });
  }
}
