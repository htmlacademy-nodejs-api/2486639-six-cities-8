import { Expose } from 'class-transformer';
import { City, Location, OfferType } from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public publishDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public type: OfferType;

  @Expose()
  public price: number;

  @Expose()
  public location: Location;
}
