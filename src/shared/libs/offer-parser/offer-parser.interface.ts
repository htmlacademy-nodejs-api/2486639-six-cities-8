import { Offer, OfferId } from '#shared/types/offer.type.js';

export interface OfferParser {
  parse(line: string, id: OfferId): Offer;
}
