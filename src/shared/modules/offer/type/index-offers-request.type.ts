import { Request } from 'express';
import { RequestBody, RequestParams, RequestQuery } from '../../../libs/rest/index.js';

export type IndexOffersRequest = Request<RequestParams, RequestBody, unknown, RequestQuery>;
