import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';
import { HttpError } from '../errors/http-error.js';
import { TokenPayload } from '../../../modules/auth/index.js';
import { Middleware } from './middleware.interface.js';
import { isString } from '../../../helpers/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    (typeof payload === 'object') && (payload !== null) && ('user' in payload) &&
    (typeof payload.user === 'object') && (payload.user !== null) &&
    ('name' in payload.user) && isString(payload.user.name) &&
    ('email' in payload.user) && isString(payload.user.email) &&
    ('id' in payload.user) && isString(payload.user.id)
  );
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };

        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {
      // т.к. подключено на все запросы. то необходимо ошибку отдать next(err)
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', this.constructor.name));
    }
  }
}
