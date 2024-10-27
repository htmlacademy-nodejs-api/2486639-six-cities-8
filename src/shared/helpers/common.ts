import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';

export function round(value: number, decimals: number = 0) {
  //http://www.jacklmoore.com/notes/rounding-in-javascript/
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number, protocol: string = 'http') {
  return `${protocol}://${host}:${port}`;
}

export function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}
