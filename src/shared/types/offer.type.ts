import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferGoods } from './offer-goods.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type OfferId = string;

export type Offer = {
  id: OfferId;
  title: string;
  description: string;
  publishDate: string;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  maxAdults: number;
  price: number;
  goods: OfferGoods;
  host: User;
  reviewCount: number;
  location: Location;
};

export type Offers = Offer[];
