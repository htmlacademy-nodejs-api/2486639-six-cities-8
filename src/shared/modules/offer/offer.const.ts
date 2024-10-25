import { CityName, OFFER_GOODS, OFFER_TYPES } from '../../types/index.js';

export enum OfferCount {
  Default = 60,
  Premium = 3
}

export const OFFER_ID = 'offerId';
export const OFFER_ID_PARAMETR = `:${OFFER_ID}`;
export const HOST_ID = 'hostId';

export enum OfferRoute {
  Root = '/',
  OfferId = `/${OFFER_ID_PARAMETR}`
}

export const OfferValidation = {
  title: {
    minLength: 10,
    maxLength: 100
  },
  description: {
    minLength: 20,
    maxLength: 1024
  },
  images: {
    count: 6
  },
  rooms: {
    min: 1,
    max: 8,
    maxDecimalPlaces: 0
  },
  maxAdults: {
    min: 1,
    max: 10,
    maxDecimalPlaces: 0
  },
  price: {
    min: 100,
    max: 100000,
    maxDecimalPlaces: 0
  }
} as const;

export const OfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${OfferValidation.title.minLength}`,
    maxLength: `Maximum title length must be ${OfferValidation.title.maxLength}`
  },
  description: {
    minLength: `Minimum description length must be ${OfferValidation.description.minLength}`,
    maxLength: `Maximum description length must be ${OfferValidation.description.maxLength}`
  },
  publishDate: {
    invalidFormat: 'publishDate must be a valid ISO date'
  },
  city: {
    invalidFormat: `city must by one of ${Object.values(CityName).join(', ')}`
  },
  previewImage: {
    invalidFormat: 'previewImage must by valid url'
  },
  images: {
    invalidFormat: 'images must by array',
    invalidArrayCount: `images must by array of ${OfferValidation.images.count} items`,
    invalidFormatItem: 'item images must by valid url'
  },
  isPremium: {
    invalidFormat: 'isPremium must by boolean'
  },
  type: {
    invalidFormat: `type must by one of ${OFFER_TYPES.join(', ')}`
  },
  rooms: {
    min: `min rooms is ${OfferValidation.rooms.min}`,
    max: `max rooms is ${OfferValidation.rooms.max}`,
    invalidFormat: `max decimal places on rooms is ${OfferValidation.rooms.maxDecimalPlaces}`
  },
  maxAdults: {
    min: `min maxAdults is ${OfferValidation.maxAdults.min}`,
    max: `max maxAdults is ${OfferValidation.maxAdults.max}`,
    invalidFormat: `max decimal places on rooms is ${OfferValidation.maxAdults.maxDecimalPlaces}`
  },
  price: {
    min: `min price is ${OfferValidation.price.min}`,
    max: `max price is ${OfferValidation.price.max}`,
    invalidFormat: `max decimal places on rooms is ${OfferValidation.price.maxDecimalPlaces}`
  },
  goods: {
    invalidFormat: 'goods must by array',
    invalidFormatItem: `item goods must by one of  ${OFFER_GOODS.join(', ')}`
  },
  hostId: {
    invalidId: 'hostId must be a valid id'
  },
  location: {
    invalidFormat: 'location must be object {latitude: number, longitude: number}'
  }
} as const;
