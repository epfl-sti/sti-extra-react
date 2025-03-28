import * as d3 from 'd3';

/**
 * Formats a numeric value into a human-readable string.
 * 
 * - If the value is greater than 1,000,000, it is divided by 1,000,000 and suffixed with "M".
 * - If the value is greater than 1,000, it is divided by 1,000 and suffixed with "k".
 * - If the value is neither, it is rounded to the nearest integer if it has no decimal part,
 *   or formatted to two decimal places otherwise.
 * 
 * @param x - The numeric value to format.
 * @returns A formatted string or the original number if no formatting is applied.
 */
function defaultFormatter(x: number): string | number {
  if (x > 1000000) {
    return `${(x / 1000000).toFixed(2)} M`;
  } else if (x > 1000) {
    return `${(x / 1000).toFixed(2)} k`;
  }
  // Avoid many decimal points in the legend.
  return Math.round(x) === x ? x : x.toFixed(2);
}

/**
 * Generates a linear scale based on the given minimum and maximum values, 
 * dividing the range into a specified number of steps. Optionally formats 
 * the scale values using a custom formatter function.
 *
 * @param minVal - The minimum value of the scale.
 * @param maxVal - The maximum value of the scale.
 * @param steps - The number of steps to divide the scale into.
 * @param legendFormatter - An optional function to format the scale values.
 *                           If not provided, a default formatter will be used.
 * @returns An array of formatted scale values, either as strings or numbers.
 */
export default function getLinearScale(
  minVal: number,
  maxVal: number,
  steps: number,
  legendFormatter?: (value: number) => string | number
): (string | number)[] {
  const getScale = d3.scaleLinear()
    .domain([minVal, maxVal])
    .range([0, maxVal]);
  
  const factor = maxVal / steps;
  const scaleValues: number[] = [];
  
  for (let i = 0; i <= steps; i++) {
    scaleValues.push(getScale(i * factor));
  }
  
  return scaleValues.map(x => legendFormatter ? legendFormatter(x) : defaultFormatter(x));
}
