import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';
import { FAVORITES_COLLECTION } from './favorite.const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FavoriteEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: FAVORITES_COLLECTION,
    timestamps: true
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId!: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
