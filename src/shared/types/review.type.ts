import { OfferId } from './offer.type.js';
import { User } from './user.type.js';

export type Review =
  {
    offerId: OfferId;
    comment: string;
    rating: number;
    publishDate: string;
    user: User;
  }

export type Reviews = Review[];
