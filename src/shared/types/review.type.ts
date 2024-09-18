import { OfferId } from './offer.type.js';
import { User } from './user.type.js';

export type ReviewId = string;

export type Review =
  {
    id: ReviewId;
    offerId: OfferId;
    date: string;
    user: User;
    comment: string;
    rating: number;
  }

export type Reviews = Review[];
