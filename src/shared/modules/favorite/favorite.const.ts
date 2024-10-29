import { OfferName } from '../offer/index.js';

export const FAVORITES_COLLECTION = 'favorites';

export enum FavoriteRoute {
  Root = '/',
  OfferId = `/:${OfferName.Id}`
}
