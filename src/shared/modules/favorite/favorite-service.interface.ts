import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  find(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  add(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  deleteById(id: string): Promise<DocumentType<FavoriteEntity> | null>;
}
