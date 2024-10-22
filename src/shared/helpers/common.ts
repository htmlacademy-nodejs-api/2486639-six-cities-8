import { ClassConstructor, plainToInstance } from 'class-transformer';

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

export function createErrorObject(message: string) {
  return { error: message };
}
