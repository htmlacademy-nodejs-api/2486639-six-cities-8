import { Expose } from 'class-transformer';
import { City, Location, OfferGoods, OfferType } from '../../../../shared/types/index.js';

export class OfferRdo {
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
  public type: OfferType;

  @Expose()
  public rooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: OfferGoods;

  @Expose()
  public hostId: string;
  //! host

  @Expose()
  public location: Location;
}
