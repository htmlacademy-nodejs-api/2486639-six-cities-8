import { Offer, OfferId } from '../../types/offer.type.js';

export interface OfferParser {
  parse(line: string, id: OfferId): Offer;
}
