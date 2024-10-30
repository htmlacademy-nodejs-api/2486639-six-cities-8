import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CityName, Location, OFFER_GOODS, OFFER_TYPES, OfferGoods, OfferType } from '../../../types/index.js';
import { OfferValidation, OfferValidationMessage } from '../offer.const.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferValidation.title.minLength, { message: OfferValidationMessage.title.minLength })
  @MaxLength(OfferValidation.title.maxLength, { message: OfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(OfferValidation.description.minLength, { message: OfferValidationMessage.description.minLength })
  @MaxLength(OfferValidation.description.maxLength, { message: OfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: OfferValidationMessage.publishDate.invalidFormat })
  public publishDate?: Date;

  @IsOptional()
  @IsEnum(CityName, { message: OfferValidationMessage.city.invalidFormat })
  public city?: CityName;

  @IsOptional()
  @IsUrl({ 'require_tld': false }, { message: OfferValidationMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(OfferValidation.images.count, { message: OfferValidationMessage.images.invalidArrayCount })
  @ArrayMaxSize(OfferValidation.images.count, { message: OfferValidationMessage.images.invalidArrayCount })
  @IsUrl({ 'require_tld': false }, { each: true, message: OfferValidationMessage.images.invalidFormatItem })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OFFER_TYPES, { message: OfferValidationMessage.type.invalidFormat })
  public type?: OfferType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: OfferValidation.rooms.maxDecimalPlaces }, { message: OfferValidationMessage.rooms.invalidFormat })
  @Min(OfferValidation.rooms.min, { message: OfferValidationMessage.rooms.min })
  @Max(OfferValidation.rooms.max, { message: OfferValidationMessage.rooms.max })
  public rooms?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: OfferValidation.maxAdults.maxDecimalPlaces }, { message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(OfferValidation.maxAdults.min, { message: OfferValidationMessage.maxAdults.min })
  @Max(OfferValidation.maxAdults.max, { message: OfferValidationMessage.maxAdults.max })
  public maxAdults?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: OfferValidation.price.maxDecimalPlaces }, { message: OfferValidationMessage.price.invalidFormat })
  @Min(OfferValidation.price.min, { message: OfferValidationMessage.price.min })
  @Max(OfferValidation.price.max, { message: OfferValidationMessage.price.max })
  public price?: number;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(OFFER_GOODS, { each: true, message: OfferValidationMessage.goods.invalidFormatItem })
  public goods?: OfferGoods;

  @IsOptional()
  @IsObject({ message: OfferValidationMessage.location.invalidFormat })
  public location?: Location;
}
