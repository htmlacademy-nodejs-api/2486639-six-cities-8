import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';

export abstract class BaseMiddleware implements Middleware {
  protected throwHttpError(httpStatusCode: number, message: string) {
    throw new HttpError(httpStatusCode, message, this.constructor.name);
  }

  public execute(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error('BaseMiddleware is abstract class');
  }
}
