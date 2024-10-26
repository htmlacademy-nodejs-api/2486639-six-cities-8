import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from './base-middleware.abstract.js';

export class ValidateObjectIdMiddleware extends BaseMiddleware {
  constructor(private param: string) {
    super();
  }

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    this.throwHttpError(StatusCodes.BAD_REQUEST, `${objectId} is invalid ObjectID`);
  }
}
