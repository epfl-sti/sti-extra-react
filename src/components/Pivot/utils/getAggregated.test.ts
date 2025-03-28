import getAggregatedValues, {
  getReducedValue,
  getNumericValue
} from './getAggregated';
import { test, expect } from 'vitest';

test('Testing the getNumericValue function', () => {
  const fromStr = getNumericValue('30');
  const fromNumber = getNumericValue(30);
  const noNumber = getNumericValue('juan');
  expect(fromStr).toBe(30);
  expect(fromNumber).toBe(30);
  expect(noNumber).toBe(0);
});

test('Testing the def count reducer', () => {
  const testArray = [5, 10, 15];
  const countReduced = getReducedValue(testArray);
  expect(countReduced).toBe(3);
});

test('Testing the sum reducer', () => {
  const testArray = [5, 10, 15];
  const sumReduced = getReducedValue(testArray, 'sum');
  expect(sumReduced).toBe(30);
});

test('Testing the avg reducer', () => {
  const testArray = [5, 10, 15];
  const testArrayWithZero = [0, 5, 10];
  const testArrayWithZeroAtTheEnd = [5, 10, 0];
  const testArrayWithZeroAtTheEndAndNull = [5, 10, 0, null];
  
  const avgReduced = getReducedValue(testArray, 'avg');
  const avgReducedWithZero = getReducedValue(testArrayWithZero, 'avg');
  const avgReducedWithZeroAtTheEnd = getReducedValue(testArrayWithZeroAtTheEnd, 'avg');
  const avgReducedWithZeroAtTheEndAndNull = getReducedValue(testArrayWithZeroAtTheEndAndNull, 'avg');
  
  expect(avgReduced).toBe(10);
  expect(avgReducedWithZero).toBe(5);
  expect(avgReducedWithZeroAtTheEnd).toBe(5);
  expect(avgReducedWithZeroAtTheEndAndNull).toBe(5);
});

test('Testing the custom reducer (min)', () => {
  const customAg = (a: number | null, b: number) => (!a || b < a) ? b : a;
  const testArray = [5, 10, 15];
  const minReduced = getReducedValue(testArray, customAg);
  expect(minReduced).toBe(5);
});

test('Testing the custom reducer (max)', () => {
  const customAg = (a: number | null, b: number) => (!a || b > a) ? b : a;
  const testArray = [5, 10, 15];
  const maxReduced = getReducedValue(testArray, customAg);
  expect(maxReduced).toBe(15);
});

test('Testing getAggregatedValues', () => {
  const items = [{ val: 1 }, { val: 2 }, { val: 3 }];
  const vals = [{ field: 'val', aggregator: 'sum' as 'sum' }];
  const reduced = getAggregatedValues(items, vals);
  expect(reduced.val).toBe(6);
});

test('Testing postprocessfn in getAggregatedValues reduced', () => {
  const items = [{ val: 1 }, { val: 2 }, { val: 3 }];
  const vals = [{ field: 'val', aggregator: 'sum' as 'sum' }];
  const postprocessfn = (res: Record<string, number>) => ({ val: res.val * 2 });
  const reduced = getAggregatedValues(items, vals, postprocessfn);
  expect(reduced.val).toBe(12);
});

test('Testing postprocessfn in getAggregatedValues mutating completely the reply', () => {
  const items = [
    { val: 1, label: 'x' },
    { val: 2, label: 'x' },
    { val: 3, label: 'y' }
  ];
  const vals = [{ field: 'val', aggregator: 'sum' as 'sum' }];
  
  const postprocessfn = (
    res: Record<string, number>,
    items: { val: number; label: string }[]
  ) => {
    const labels = Array.from(new Set(items.map(x => x.label)));
    const reducedByFn = labels.reduce<Record<string, number>>((obj, label) => {
      obj[label] = items
        .filter(x => x.label === label)
        .map(x => x.val)
        .reduce((a, b) => a + b, 0);
      return obj;
    }, {});
    return { ...reducedByFn, ...res };
  };
  
  const reduced = getAggregatedValues(items, vals, postprocessfn);
  expect(reduced.x).toBe(3);
  expect(reduced.y).toBe(3);
  expect(reduced.val).toBe(6);
});
