import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { ParamOfferId } from '../offer/index.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

export type CreateReviewRequest = Request<ParamOfferId, RequestBody, CreateReviewDto>;
