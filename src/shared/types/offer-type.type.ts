export const OFFER_TYPES = [
  'apartment',
  'house',
  'room',
  'hotel'
] as const;

export type OfferType = typeof OFFER_TYPES[number];
