export const DEFAULT_REVIEW_COUNT = 50;

export const REVIEWS_COLLECTION = 'reviews';

export const ReviewValidation = {
  comment: {
    minLength: 5,
    maxLength: 1024
  },
  rating: {
    min: 1,
    max: 5,
    maxDecimalPlaces: 0
  }
} as const;

export const ReviewValidationMessage = {
  comment: {
    minLength: `Minimum comment length must be ${ReviewValidation.comment.minLength}`,
    maxLength: `Maximum comment length must be ${ReviewValidation.comment.maxLength}`
  },
  rating: {
    min: `min rating is ${ReviewValidation.rating.min}`,
    max: `max rating is ${ReviewValidation.rating.max}`,
    invalidFormat: `max decimal places on rating is ${ReviewValidation.rating.maxDecimalPlaces}`
  }
} as const;
