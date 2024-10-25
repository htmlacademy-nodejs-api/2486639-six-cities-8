import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewEntity } from './review.entity.js';

export interface ReviewService {
  create(dto: CreateReviewDto, offerId: string): Promise<DocumentType<ReviewEntity>>;
  findByOfferId(offerId: string, count?: number): Promise<DocumentType<ReviewEntity>[] | null>;
  getRatingOfferId(offerId: string): Promise<number>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}

