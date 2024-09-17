import { OfferId } from './offer.type.js';
import { User } from './user.type.js';

//! если не понадобится то объеденить в Review
export type BaseReview = {
  comment: string;
  rating: number;
};

//! если не понадобится то объеденить в Review
export type OfferBaseReview =
  { offerId: OfferId }
  & BaseReview;

export type ReviewId = string;

export type Review =
  {
    id: ReviewId;
    date: string;
    user: User;
  }
  & BaseReview;

export type Reviews = Review[];
