import { City, Location, Type } from '../../types/types';
import { UserDto } from '../user/user.dto';

export class DetailOfferDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: Type;
  public rooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public host!: UserDto;
  public location!: Location;
}
