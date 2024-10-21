import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  exists(id: string): Promise<boolean>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremium(): Promise<DocumentType<OfferEntity>[]>;
  incReviewCount(id: string): Promise<DocumentType<OfferEntity> | null>
}
