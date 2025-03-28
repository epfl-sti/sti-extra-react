import { test, expect } from 'vitest';
import getGroupedData, {
  getGroups,
  calculateSectionPercentageValue
} from './getGrouped'

import data from '../testData/index.json'
import { separator, subtotalsSuffix } from './settings'

test('Testing the getGroups fn', () => {
  const groups = getGroups(data, ['continent', 'country'])
  expect(Object.keys(groups).length).toBe(244)
})

test('Testing the getGroups fn getting section totals', () => {
  const groups = getGroups(data, ['continent', 'country'], true)
  expect(Object.keys(groups).length).toBe(251)
})

test('Testing the main grouped data fn', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes: ['continent'],
    vals: [{ field: 'population' }]
  })
  expect(grouped.Asia.population).toBe(50)
  expect(grouped.Europe.population).toBe(51)
})

test('Testing the main grouped data fn', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes: ['continent', 'country'],
    vals: [{ field: 'population', aggregator: 'sum' }],
    showSectionTotals: true
  })
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].population).toBe(1278740761)
})

test('Testing calculate totals percentage', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes: ['continent', 'country'],
    vals: [{ field: 'population', aggregator: 'sum' }],
    showSectionTotals: true,
    calculateTotalsPercentage: true
  })
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].population).toBe(1278740761)
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].perc_total).toBe('16.74%')
})

test('Testing calculate totals and sections percentage', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes: ['continent', 'country'],
    vals: [{ field: 'population', aggregator: 'sum' }],
    showSectionTotals: true,
    calculateTotalsPercentage: true,
    calculateSectionPercentage: true
  })
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].population).toBe(1278740761)
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].perc_total).toBe('16.74%')
  expect(grouped[`Africa${separator}${subtotalsSuffix}Totals`].perc_section).toBe('100.00%')
})

test('Testing calculateSectionPercentageValue function', () => {
  const testData = {
    value: 50,
    key: `Test1${separator}AnotherField`,
    subTotalsSet: {
      [`Test1${separator}${subtotalsSuffix}Totals`]: { sampleValue: 100 },
      [`Test2${separator}${subtotalsSuffix}Totals`]: { sampleValue: 200 },
      [`Test3${separator}${subtotalsSuffix}Totals`]: { sampleValue: 300 }
    },
    valKey: 'sampleValue'
  }
  const { value, key, subTotalsSet, valKey } = testData
  const subTotalKeys = Object.keys(subTotalsSet)
  const results = calculateSectionPercentageValue(value, key, subTotalsSet, valKey)
  const resultTotalKey = calculateSectionPercentageValue(subTotalsSet[subTotalKeys[0]], subTotalKeys[0], subTotalsSet, valKey)
  expect(results).toBe('50.00%')
  expect(resultTotalKey).toBe('100.00%')
})
