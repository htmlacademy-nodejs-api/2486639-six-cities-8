import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CityName, Location, OFFER_GOODS, OFFER_TYPES, OfferGoods, OfferType } from '../../../types/index.js';
import { OfferValidation, OfferValidationMessage } from '../offer.const.js';

export class CreateOfferDto {
  @MinLength(OfferValidation.title.minLength, { message: OfferValidationMessage.title.minLength })
  @MaxLength(OfferValidation.title.maxLength, { message: OfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(OfferValidation.description.minLength, { message: OfferValidationMessage.description.minLength })
  @MaxLength(OfferValidation.description.maxLength, { message: OfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: OfferValidationMessage.publishDate.invalidFormat })
  public publishDate: Date;

  @IsEnum(CityName, { message: OfferValidationMessage.city.invalidFormat })
  public city: CityName;

  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalidFormat })
  public previewImage: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(OfferValidation.images.count, { message: OfferValidationMessage.images.invalidArrayCount })
  @ArrayMaxSize(OfferValidation.images.count, { message: OfferValidationMessage.images.invalidArrayCount })
  @IsUrl({}, { each: true, message: OfferValidationMessage.images.invalidFormatItem })
  public images: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OFFER_TYPES, { message: OfferValidationMessage.type.invalidFormat })
  public type: OfferType;

  @IsNumber({ maxDecimalPlaces: OfferValidation.rooms.maxDecimalPlaces }, { message: OfferValidationMessage.rooms.invalidFormat })
  @Min(OfferValidation.rooms.min, { message: OfferValidationMessage.rooms.min })
  @Max(OfferValidation.rooms.max, { message: OfferValidationMessage.rooms.max })
  public rooms: number;

  @IsNumber({ maxDecimalPlaces: OfferValidation.maxAdults.maxDecimalPlaces }, { message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(OfferValidation.maxAdults.min, { message: OfferValidationMessage.maxAdults.min })
  @Max(OfferValidation.maxAdults.max, { message: OfferValidationMessage.maxAdults.max })
  public maxAdults: number;

  @IsNumber({ maxDecimalPlaces: OfferValidation.price.maxDecimalPlaces }, { message: OfferValidationMessage.price.invalidFormat })
  @Min(OfferValidation.price.min, { message: OfferValidationMessage.price.min })
  @Max(OfferValidation.price.max, { message: OfferValidationMessage.price.max })
  public price: number;

  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(OFFER_GOODS, { each: true, message: OfferValidationMessage.goods.invalidFormatItem })
  public goods: OfferGoods;

  public hostId: string;
  public location: Location;
}
