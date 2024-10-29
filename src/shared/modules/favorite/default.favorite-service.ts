import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { FavoriteEntity } from './favorite.entity.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) { }

  public find(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOne({ offerId, userId });
  }

  public async findByUserId(_userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    this.logger.info('DefaultFavoriteService.findByUserId');
    this.logger.info(this.favoriteModel.collection.name);

    return [];
  }

  public async add(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    const result = await this.favoriteModel.create({ offerId, userId });

    this.logger.info(`New favorite created: offerId:${offerId} userId:${userId}`);

    return result;
  }

  public async deleteById(id: string): Promise<DocumentType<FavoriteEntity> | null> {
    const result = await this.favoriteModel.findByIdAndDelete(id);

    if (result) {
      this.logger.info(`Favorite deleted: offerId:${result.offerId} userId:${result.userId}`);
    }

    return result;
  }
}
