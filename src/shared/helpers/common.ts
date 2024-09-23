export function round(value: number, decimals: number = 0) {
  //http://www.jacklmoore.com/notes/rounding-in-javascript/
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
