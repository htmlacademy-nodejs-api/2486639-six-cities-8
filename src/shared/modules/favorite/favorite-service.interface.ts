import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  find(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  exists(offerId: string, userId: string): Promise<boolean>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  findOffersByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  add(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  deleteById(id: string): Promise<DocumentType<FavoriteEntity> | null>;
  deleteByOfferId(offerId: string): Promise<number>;
}
