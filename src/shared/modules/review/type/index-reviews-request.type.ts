import { Request } from 'express';
import { RequestBody, RequestQuery } from '../../../libs/rest/index.js';
import { ParamOfferId } from '../../offer/index.js';

export type IndexReviewsRequest = Request<ParamOfferId, RequestBody, unknown, RequestQuery>;
