import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from './base-middleware.abstract.js';
import { DocumentExists } from '../../../types/index.js';

export class DocumentExistsMiddleware extends BaseMiddleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {
    super();
  }

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (! await this.service.exists(documentId)) {
      this.throwHttpError(StatusCodes.NOT_FOUND, `${this.entityName} with ${documentId} not found.`);
    }

    next();
  }
}
