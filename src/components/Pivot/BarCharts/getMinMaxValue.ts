import * as d3 from 'd3';

/**
 * Computes the minimum and maximum values from a 2D array of pivot data.
 *
 * @param pivotData - A 2D array where each inner array contains objects with a `type` and `value` property.
 *                    Only objects with `type` equal to `'value'` are considered for computation.
 * @returns An object containing:
 *          - `calcMinValue`: The minimum value found in the filtered data, or `0` if no values are present.
 *          - `calcMaxValue`: The maximum value found in the filtered data, or `0` if no values are present.
 */
export default function getMinMaxValues(pivotData: Array<Array<{ type: string; value: number }>>) {
  const flatData = pivotData
    .map(arr => arr.filter(x => x.type === 'value').map(x => x.value))
    .flat();

  return {
    calcMinValue: d3.min(flatData) ?? 0,
    calcMaxValue: d3.max(flatData) ?? 0,
  };
}
