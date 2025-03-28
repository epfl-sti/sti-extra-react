import { test, expect } from 'vitest';

import getGroupedData from './getGrouped'
import getSortedkeys from './getSortedKeys'

import data from '../testData/index.json'
import { separator, subtotalsSuffix } from './settings'

const rowAttributes = ['continent', 'country']
const vals = [{ field: 'population', aggregator: 'sum' }]

test('Testing the Standard Key Sorting', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes,
    vals
  })
  const standardSortedKeys = getSortedkeys(grouped, rowAttributes, ['population'])
  expect(standardSortedKeys[0]).toBe(`Africa${separator}Algeria`)
})

test('Testing the reverse the continent dimension Key Sorting', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes,
    vals
  })

  const orderBy = [{ field: 'continent', order: 'desc' }]
  const reverseContinentSortedKeys = getSortedkeys(grouped, rowAttributes, ['population'], orderBy)
  expect(reverseContinentSortedKeys[0]).toBe(`South America${separator}Argentina`)
})

test('Testing the reverse the continent and country dimensions Key Sorting', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes,
    vals
  })

  const orderBy = [{ field: 'continent', order: 'desc' }, { field: 'country', order: 'desc' }]
  const reverseContinentSortedKeys = getSortedkeys(grouped, rowAttributes, ['population'], orderBy)
  expect(reverseContinentSortedKeys[0]).toBe(`South America${separator}Venezuela`)
})

test('Testing the reverse the continent and country dimensions Key Sorting with section totals', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes,
    vals,
    showSectionTotals: true
  })

  const orderBy = [{ field: 'continent', order: 'desc' }, { field: 'country', order: 'desc' }]
  const reverseContinentSortedKeys = getSortedkeys(grouped, rowAttributes, ['population'], orderBy)
  expect(reverseContinentSortedKeys[0]).toBe(`South America${separator}Venezuela`)
  expect(reverseContinentSortedKeys.indexOf(`South America${separator}${subtotalsSuffix}Totals`)).toBeGreaterThan(0)
})

test('Testing the reverse the continent and section percentage dimensions Key Sorting with section totals', () => {
  const { grouped } = getGroupedData({
    data,
    rowAttributes,
    vals,
    showSectionTotals: true,
    calculateTotalsPercentage: true,
    calculateSectionPercentage: true
  })

  const orderBy = [{ field: 'continent', order: 'desc' }, { field: 'perc_section', order: 'desc' }]
  const reverseContinentSortedKeys = getSortedkeys(grouped, rowAttributes, ['population', 'perc_section'], orderBy)
  expect(reverseContinentSortedKeys[0]).toBe(`South America${separator}Brazil`)
})
