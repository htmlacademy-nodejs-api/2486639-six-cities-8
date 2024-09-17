import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type OfferId = string;

export type BaseOffer = {
  id: OfferId;
  type: OfferType
  title: string;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  user: User;
};

export type Offer = BaseOffer & { previewImage: string };

export type Offers = Offer[];

//! нужно?
export type DetailOffer =
  BaseOffer
  & {
    description: string;
    bedrooms: number;
    goods: string[];
    host: User;
    images: string[];
    maxAdults: number;
  };

export type DetailOffers = DetailOffer[];
