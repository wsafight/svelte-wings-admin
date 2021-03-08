export function round(number: number | string, precision = 2): number {
  return Math.round(+(number + 'e' + precision)) / Math.pow(10, precision);
}
