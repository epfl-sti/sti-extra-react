import { test, expect } from 'vitest';
import getChunks from './getChunks'

test('Testing default chunking', () => {
  const testArray = [1, 2, 3, 4, 5, 6]
  const chunkedArray = getChunks(testArray)
  expect(testArray.length).toBe(6)
  expect(chunkedArray.length).toBe(3)
})

test('Testing chunking with custom itemsPerChunk', () => {
  const testArray = [1, 2, 3, 4, 5, 6]
  const chunkedArray = getChunks(testArray, 3)
  expect(testArray.length).toBe(6)
  expect(chunkedArray.length).toBe(2)
})
