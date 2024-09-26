import { Offer, OfferId } from '#src/shared/types/offer.type.js';

export interface OfferParser {
  parse(line: string, id: OfferId): Offer;
}
