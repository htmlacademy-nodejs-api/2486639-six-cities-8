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

  public async findByUserId(_userId: string): Promise<DocumentType<FavoriteEntity[]> | null> {
    this.logger.info('DefaultFavoriteService.findByUserId');
    this.logger.info(this.favoriteModel.collection.name);

    return null;
  }

  public async add(_favorite: FavoriteEntity): Promise<DocumentType<FavoriteEntity> | null> {
    this.logger.info('DefaultFavoriteService.add');

    return null;
  }

  public async delete(_favorite: FavoriteEntity): Promise<DocumentType<FavoriteEntity> | null> {
    this.logger.info('DefaultFavoriteService.delete');

    return null;
  }
}
