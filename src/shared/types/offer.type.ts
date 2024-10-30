import { CityName } from './city-name.enum.js';
import { Location } from './location.type.js';
import { OfferGoods } from './offer-goods.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type OfferId = string;

export type Offer = {
  title: string;
  description: string;
  publishDate: Date;
  cityName: CityName;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  maxAdults: number;
  price: number;
  goods: OfferGoods;
  host: User;
  location: Location;
};

export type Offers = Offer[];
