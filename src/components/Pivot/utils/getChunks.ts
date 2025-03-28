// Adapted from: https://stackoverflow.com/questions/8495687/split-array-into-chunks
/**
 * Splits an array into smaller chunks of a specified size.
 *
 * @template T - The type of elements in the input array.
 * @param array - The array to be divided into chunks.
 * @param itemsPerChunk - The maximum number of items per chunk. Defaults to 2.
 * @returns An array of chunks, where each chunk is an array containing up to `itemsPerChunk` elements.
 *
 * @example
 * ```typescript
 * const result = getChunks([1, 2, 3, 4, 5], 2);
 * console.log(result); // [[1, 2], [3, 4], [5]]
 * ```
 */
export default function getChunks<T>(array: T[], itemsPerChunk = 2): T[][] {
  return array.reduce<T[][]>((allChunks, thisChunk, index) => {
    const chunk = Math.floor(index / itemsPerChunk);
    allChunks[chunk] = [].concat((allChunks[chunk] || []), thisChunk);
    return allChunks;
  }, []);
}