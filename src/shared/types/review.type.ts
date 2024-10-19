import { OfferId } from './offer.type.js';
import { User } from './user.type.js';

export type Review =
  {
    offerId: OfferId;
    comment: string;
    date: string;
    rating: number;
    user: User;
  }

export type Reviews = Review[];
