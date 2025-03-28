
type AggregatorFunction = (a: number, b: number) => number;
export type FormatterFunction = (value: number) => number;

export type Aggregator = 'sum' | 'avg' | 'median' | AggregatorFunction | undefined;

type Item = Record<string, unknown>;
export type ValueDescriptor = {
  field: string;
  aggregator: Aggregator;
  formatter?: FormatterFunction;
};

/**
 * Converts the given value to a numeric value.
 *
 * If the value cannot be parsed into a valid number, the function returns 0.
 *
 * @param value - The input value to be converted to a number. Typically expected to be a string or a value that can be coerced into a string.
 * @returns The numeric representation of the input value, or 0 if the value is not a valid number.
 */
export function getNumericValue(value: unknown): number {

  const numValue = parseFloat(value as string);
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Reduces an array of values using a specified aggregation method and optionally formats the result.
 *
 * @param values - An array of values to be reduced. Non-numeric, `null`, and `undefined` values are filtered out.
 * @param aggregator - The aggregation method to apply. Can be one of the following:
 *   - `'sum'`: Calculates the sum of the numeric values.
 *   - `'avg'`: Calculates the average of the numeric values.
 *   - `'median'`: Calculates the median of the numeric values.
 *   - A custom function: A user-defined function that takes two numbers and returns a reduced value.
 * @param formatter - An optional function to format the resulting numeric value.
 * @returns The reduced numeric value after applying the aggregator and formatter. If no aggregator is provided, returns the length of the input array.
 */
export function getReducedValue(
  values: unknown[],
  aggregator?: Aggregator,
  formatter?: FormatterFunction
): number {

  // only get the number values
  const numericValues = values
    .filter(x => !isNaN(x as number) && x !== null && x !== undefined)
    .map(x => getNumericValue(x));

  if (aggregator === 'sum') {
    const rawValue = numericValues.reduce((a: number, b) => a + (getNumericValue(b) || 0), 0)
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'avg') {
    const rawValue = numericValues.reduce((a: number, b: unknown) => a + getNumericValue(b), 0) / numericValues.length
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'median') {
    const rawValue: number = getNumericValue(numericValues[Math.round(values.length / 2)]);
    return formatter ? formatter(rawValue) : rawValue
  }
  if (typeof aggregator === 'function') {
    const rawValue = numericValues.reduce((a, b) => aggregator(a, b) as number)
    return formatter ? formatter(rawValue) : rawValue
  }
  return values.length
}

/**
 * Aggregates values from a list of items based on specified descriptors and an optional post-processing function.
 *
 * @param items - An array of items to aggregate values from.
 * @param vals - An array of value descriptors, each containing the field to aggregate, 
 *               the aggregation method, and an optional formatter.
 * @param postprocessfn - An optional function to post-process the aggregated results. 
 *                        It receives the reduced record and the original items as arguments.
 * @returns A record where keys are the fields specified in the value descriptors, 
 *          and values are the aggregated results.
 */
export default function getAggregatedValues(
  items: Item[],
  vals: ValueDescriptor[],
  postprocessfn?: any
): Record<string, number> {
  const reduced: Record<string, number> = {};
  vals.forEach((val) => {
    const values = items.map((item) => item[val.field]);
    reduced[val.field] = getReducedValue(values, val.aggregator, val.formatter);
  });
  return postprocessfn ? postprocessfn(reduced, items) : reduced;
}
