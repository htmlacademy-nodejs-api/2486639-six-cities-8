import { CityName, Location, Type } from '../../types/types';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publishDate!: string;
  public city!: CityName;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public type!: Type;
  public rooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public location!: Location;
}
