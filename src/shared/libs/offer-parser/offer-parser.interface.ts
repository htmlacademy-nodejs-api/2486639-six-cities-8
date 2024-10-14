import { Offer } from '../../types/offer.type.js';

export interface OfferParser {
  parse(line: string): Offer;
}
