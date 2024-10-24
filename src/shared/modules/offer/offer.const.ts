export const DEFAULT_OFFER_COUNT = 60;
export const PREMIUN_OFFER_COUNT = 3;
export const OFFER_ID = 'offerId';
export const OFFER_ID_PARAMETR = `:${OFFER_ID}`;
export enum OfferRoute {
  Root = '/',
  OfferId = `/${OFFER_ID_PARAMETR}`
}
