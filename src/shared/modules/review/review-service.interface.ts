import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewEntity } from './review.entity.js';

export interface ReviewService {
  create(dto: CreateReviewDto, offerId: string, userId: string): Promise<DocumentType<ReviewEntity>>;
  findByOfferId(offerId: string, count?: number): Promise<DocumentType<ReviewEntity>[] | null>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
