import { Expose, Type } from 'class-transformer';
import { City, Location, OfferGoods, OfferType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class DetailOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publishDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public rooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: OfferGoods;

  @Expose({ name: 'hostId' })
  @Type(() => UserRdo)
  public host: UserRdo;

  @Expose()
  public location: Location;
}
