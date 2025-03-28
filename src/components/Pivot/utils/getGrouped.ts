import { separator, subtotalsSuffix } from './settings';
import getAggregatedValues, { Aggregator, FormatterFunction, ValueDescriptor } from './getAggregated';

type DataItem = any;
type GroupedData = Record<string, DataItem[]>;
type AggregatedData = Record<string, any>;
type ValueKey = { field: string; aggregator?: Aggregator; formatter?: FormatterFunction };

type GetGroupedDataParams = {
  data: DataItem[];
  rowAttributes: string[];
  vals: ValueKey[];
  postprocessfn?: (data: DataItem[]) => DataItem[];
  getOriginalsFlag?: boolean;
  showSectionTotals?: boolean;
  calculateSectionPercentage?: boolean;
  calculateTotalsPercentage?: boolean;
};

/**
 * Generates a combined key string based on the specified row attributes of a data item. ie. Europe___Switzerland, etc
 *
 * @param dataItem - The data item object containing attributes to be combined.
 * @param rowAttributes - An array of attribute names to be used for generating the key.
 * @returns A string representing the combined key, where each attribute value is joined by a separator.
 *
 * Note: If an attribute is missing or undefined in the data item, it will be replaced with a single space (' ') in the key.
 */
function getCombinedKeyBasedOnRowAttributes(dataItem: DataItem, rowAttributes: string[]): string {
  const keyArray = rowAttributes.map(rowAttribute => dataItem[rowAttribute] || ' ');
  return keyArray.join(separator);
}

export function getGroups(data: DataItem[], rowAttributes: string[], showSectionTotals?: boolean): GroupedData {
  const grouped: GroupedData = {};

  data.forEach(dataItem => {
    const combinedKeyArray = getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes);
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || [];
    grouped[combinedKeyArray].push(dataItem);

    if (showSectionTotals && rowAttributes.length > 1) {
      const combinedSplit = combinedKeyArray.split(separator);
      const getTotalLabel = (i: number) => (i === combinedSplit.length - 1 ? `${subtotalsSuffix}Totals` : subtotalsSuffix);
      const combinedKeyshowSectionTotals = combinedSplit.map((x, i) => (i === 0 ? x : getTotalLabel(i))).join(separator);
      grouped[combinedKeyshowSectionTotals] = grouped[combinedKeyshowSectionTotals] || [];
      grouped[combinedKeyshowSectionTotals].push(dataItem);
    }
  });

  return grouped;
}

/**
 * Calculates the percentage value of a section relative to its subtotal.
 *
 * @param value - The numeric value of the section to calculate the percentage for.
 * @param key - The key identifying the section.
 * @param subTotalsSet - An object containing grouped subtotal data.
 * @param valKey - The key used to retrieve the subtotal value from the grouped data.
 * @returns A string representing the percentage value of the section, formatted to two decimal places, followed by a '%' sign.
 * @throws Will throw an error if the subtotal value for the given key and valKey is undefined.
 */
export function calculateSectionPercentageValue(value: number, key: string, subTotalsSet: Record<string, Record<string, number>>, valKey: string): string {
  const keyPrefix = key.split(separator)[0];
  const subtotalSectionKey = Object.keys(subTotalsSet).filter(x => x.includes(`${keyPrefix}${separator}`))[0];
  
  if (key === subtotalSectionKey) {
    return '100.00%';
  }
  
  const subtotalValue = subTotalsSet[subtotalSectionKey]?.[valKey];
  if (subtotalValue === undefined) {
    throw new Error(`Subtotal value for key "${subtotalSectionKey}" and valKey "${valKey}" is undefined.`);
  }
  
  return `${((value / subtotalValue) * 100).toFixed(2)}%`;
}


/**
 * Processes and groups data based on specified attributes, calculates aggregated values,
 * and optionally computes percentages for sections and totals.
 *
 * @param {GetGroupedDataParams} params - The parameters for grouping and processing data.
 * @param {Array<any>} params.data - The input data to be grouped and processed.
 * @param {Array<string>} params.rowAttributes - The attributes used to group the data.
 * @param {Array<ValueDescriptor>} params.vals - The descriptors for values to be aggregated.
 * @param {Function} [params.postprocessfn] - An optional function to post-process aggregated values.
 * @param {boolean} [params.getOriginalsFlag] - If true, includes original grouped data in the result.
 * @param {boolean} [params.showSectionTotals] - If true, includes section totals in the grouping.
 * @param {boolean} [params.calculateSectionPercentage] - If true, calculates percentages for sections.
 * @param {boolean} [params.calculateTotalsPercentage] - If true, calculates percentages for totals.
 *
 * @returns {Object} An object containing grouped data, aggregated values, and optionally percentages.
 * @returns {Record<string, AggregatedData>} return.grouped - The grouped and processed data.
 * @returns {Record<string, AggregatedData>} [return.groupedOriginals] - The original grouped data (if `getOriginalsFlag` is true).
 * @returns {AggregatedData} return.valueTotals - The aggregated totals for the entire dataset.
 */
export default function getGroupedData({
  data,
  rowAttributes,
  vals,
  postprocessfn,
  getOriginalsFlag,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
}: GetGroupedDataParams) {
  const grouped = getGroups(data, rowAttributes, showSectionTotals);

  if (getOriginalsFlag) {
    const groupedOriginals = { ...grouped };
    Object.keys(grouped).forEach(key => {
      grouped[key] = getAggregatedValues(grouped[key] as DataItem[], vals as ValueDescriptor[], postprocessfn);
      groupedOriginals[key] = postprocessfn ? getAggregatedValues(groupedOriginals[key], vals as ValueDescriptor[]) : grouped[key];
    });

    const valueTotals = getAggregatedValues(data, vals as ValueDescriptor[], postprocessfn);
    return { groupedOriginals, grouped, valueTotals };
  }

  Object.keys(grouped).forEach(key => {
    grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn);
  });
  
  const valueTotals = getAggregatedValues(data, vals, postprocessfn);

  if (vals.length === 1 && (calculateTotalsPercentage || (calculateSectionPercentage && showSectionTotals))) {
    let subTotalsSet: GroupedData = {};
    const valKey = vals[0].field as string;

    if (showSectionTotals && calculateSectionPercentage) {
      subTotalsSet = Object.keys(grouped)
        .filter(key => key.includes(subtotalsSuffix))
        .reduce((obj, key) => {
          obj[key] = grouped[key];
          return obj;
        }, {} as GroupedData);
    }

    const groupedPerc = Object.keys(grouped).reduce((obj, key) => {
      const groupItem = grouped[key] as AggregatedData;
      const value = groupItem[valKey];
      obj[key] = {
        ...groupItem,
        perc_section: calculateSectionPercentage && showSectionTotals ? calculateSectionPercentageValue(value, key, subTotalsSet, valKey) : null,
        perc_total: calculateTotalsPercentage ? `${((value / valueTotals[valKey]) * 100).toFixed(2)}%` : null,
      };
      return obj;
    }, {} as Record<string, AggregatedData>);

    const valueTotalsPerc = {
      ...valueTotals,
      perc_section: calculateSectionPercentage && showSectionTotals ? '100.00%' : null,
      perc_total: calculateTotalsPercentage ? '100.00%' : null,
    };

    return { grouped: groupedPerc, valueTotals: valueTotalsPerc };
  }

  return { grouped, valueTotals };
}