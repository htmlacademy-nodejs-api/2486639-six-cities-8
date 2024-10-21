import { CityName, Location, OfferGoods, OfferType } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public publishDate?: Date;
  public cityName?: CityName;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: OfferType;
  public rooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: OfferGoods;
  public location?: Location;
}
