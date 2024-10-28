import { inject, injectable } from 'inversify';
import { DEFAULT_STATIC_IMAGES, EXTERNAL_LINK_STARTS, STATIC_RESOURCE_FIELDS } from './path-transformer.constant.js';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../../../../rest/index.js';
import { getFullServerPath, isObject, isString, isStringArray } from '../../../helpers/index.js';
import { Config, RestSchema } from '../../config/index.js';

@injectable()
export class PathTransformer {
  private fullServerPath: string;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');

    this.fullServerPath = getFullServerPath(serverHost, serverPort);

    this.logger.info('PathTranformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private getRootPath(value: string) {
    return this.hasDefaultImage(value) ? Route.Static : Route.Upload;
  }

  private transrormPath(value: string) {
    // в значении может быть внешний url
    if (EXTERNAL_LINK_STARTS.some((linkStart) => value.startsWith(linkStart))) {
      return value;
    }

    return `${this.fullServerPath}${this.getRootPath(value)}/${value}`;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];
          const isValueStringArray = isStringArray(value);

          if (isObject(value) && !isValueStringArray) {
            stack.push(value);

            continue;
          }

          if (this.isStaticProperty(key)) {
            if (isString(value)) {
              current[key] = this.transrormPath(value);
            } else if (isValueStringArray) {
              current[key] = value.map((item) => this.transrormPath(item));
            }
          }
        }
      }
    }

    return data;
  }
}
