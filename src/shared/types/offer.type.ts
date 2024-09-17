import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferGoods } from './offer-goods.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type OfferId = string;

export type Offer = {
  id: OfferId;
  type: OfferType;
  title: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  user: User;
  previewImage: string;
  description: string;
  bedrooms: number;
  goods: OfferGoods;
  host: User;
  images: string[];
  maxAdults: number;
};

export type Offers = Offer[];
