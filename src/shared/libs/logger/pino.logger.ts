import { resolve } from 'node:path';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { Logger } from './logger.interface.js';
import { getRootDirectoryPath } from '../../helpers/index.js';
import { LOG_PATH } from '../../../const.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const destination = resolve(getRootDirectoryPath(), LOG_PATH);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          level: 'debug',
          options: { destination }
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {}
        }
      ]
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created...');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: unknown, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
