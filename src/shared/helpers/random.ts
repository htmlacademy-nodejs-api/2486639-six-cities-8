import dayjs from 'dayjs';

export function getRandomNumber(min: number, max: number, numAfterDigit: number = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItem<T>(items: T[]): T {
  return items[getRandomNumber(0, items.length - 1)];
}

export function getRandomObjectKey<T extends object>(obj: T): keyof T {
  const objKeys = Object.keys(obj) as Array<keyof T>;

  return getRandomItem(objKeys);
}

export function createIdGenerator(minNumber: number = 0, maxNumber: number = 0) {
  const previousValues: number[] = [];

  return (): number => {
    let currentValue = getRandomNumber(minNumber, maxNumber);

    if (previousValues.length >= (maxNumber - minNumber + 1)) {
      throw new Error('All id generated!');
    }

    while (previousValues.includes(currentValue)) {
      currentValue = getRandomNumber(minNumber, maxNumber);
    }
    previousValues.push(currentValue);

    return currentValue;
  };
}

export function getRandomItems<T>(items: T[], maxCount = 1, minCount = 1): T[] {
  const { length } = items;

  if ((!length) || (maxCount < 1) || (minCount < 0)) {
    return [];
  }

  if (maxCount === 1) {
    return [getRandomItem<T>(items)];
  }

  if (maxCount >= length) {
    return structuredClone(items);
  }

  const generateElemetIndex = createIdGenerator(0, length - 1);

  return Array.from({ length: getRandomNumber(minCount, maxCount) }, () => items[generateElemetIndex()]);
}


export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomDate(minDateISO: string, maxDateISO: string): Date {
  const date = new Date();
  const minDateMilliseconds = dayjs(minDateISO).toDate().getTime();
  const maxDateMilliseconds = dayjs(maxDateISO).toDate().getTime();

  date.setTime(minDateMilliseconds + Math.random() * (maxDateMilliseconds - minDateMilliseconds));

  return date;
}
