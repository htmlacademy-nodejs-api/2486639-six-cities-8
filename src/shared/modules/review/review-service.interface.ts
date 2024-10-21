import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewEntity } from './review.entity.js';

export interface ReviewService {
  create(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<ReviewEntity>[] | null>;
}

