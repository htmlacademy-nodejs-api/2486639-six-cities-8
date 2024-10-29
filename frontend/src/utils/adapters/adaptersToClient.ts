import { User, Offer, Comment } from '../../types/types';
import { DetailOfferDto } from '../../dto/offer/detail-offer.dto';
import { UserDto } from '../../dto/user/user.dto';
import { ReviewDto } from '../../dto/reviews/review.dto';

export const adaptUserToClient = (user: UserDto): User => {
  const {
    name,
    email,
    avatarPath,
    type
  } = user;

  return {
    name,
    email,
    avatarUrl: avatarPath,
    type
  };
};

export const adaptDetailOfferToClient = (offer: DetailOfferDto): Offer => {
  const {
    id,
    title,
    description,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    maxAdults,
    price,
    goods,
    host,
    location
  } = offer;

  return {
    id,
    price,
    rating,
    title,
    isPremium,
    isFavorite,
    city,
    location,
    previewImage,
    type,
    bedrooms: rooms,
    description,
    goods,
    host: adaptUserToClient(host),
    images,
    maxAdults
  };
};

export const adaptReviewToClient = (review: ReviewDto): Comment => {
  const {
    id,
    comment,
    rating,
    publishDate,
    user,
  } = review;

  return {
    id,
    comment,
    date: publishDate,
    rating,
    user: adaptUserToClient(user)
  };
};

export const adaptReviewsToClient = (reviews: ReviewDto[]): Comment[] =>
  reviews.map((review) => adaptReviewToClient(review));
