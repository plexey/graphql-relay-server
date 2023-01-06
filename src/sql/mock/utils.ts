export const now = Math.round(Date.now() / 1000);

export const randValueInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randArrayIndex = (array: any[]) =>
  Math.floor(Math.random() * array.length);
