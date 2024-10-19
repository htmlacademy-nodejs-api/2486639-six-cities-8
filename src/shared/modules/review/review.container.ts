import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { ReviewService } from './review-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultReviewService } from './default-review.service.js';
import { ReviewEntity, ReviewModel } from './review.entity.js';

export function createReviewContainer() {
  const offerContainer = new Container();

  offerContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService);
  offerContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);

  return offerContainer;
}
