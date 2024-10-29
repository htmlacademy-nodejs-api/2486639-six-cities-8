import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity[]> | null>;
  add(favorite: FavoriteEntity): Promise<DocumentType<FavoriteEntity> | null>;
  delete(favorite: FavoriteEntity): Promise<DocumentType<FavoriteEntity> | null>;
}
