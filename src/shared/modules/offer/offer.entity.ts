import { defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { City, Location, OfferGoods, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { OfferName } from './offer.const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: OfferName.Collection,
    timestamps: true
  },
  options: { allowMixed: Severity.ALLOW }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true
  })
  public title!: string;

  @prop({ trim: true })
  public description!: string;

  @prop({ required: true })
  public publishDate!: Date;

  @prop({ required: true })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  public isFavorite?: boolean;

  @prop({ default: 0 })
  public rating!: number;

  @prop({ required: true })
  public type!: OfferType;

  @prop({ required: true })
  public rooms!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true })
  public goods!: OfferGoods;

  @prop({
    ref: UserEntity,
    required: true
  })
  public hostId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public reviewCount!: number;

  @prop()
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
