import { separator, subtotalsSuffix } from './settings';
import getSortedKeys from './getSortedKeys';

interface CountObject {
  count: number;
  prevKey: string;
}

interface LineItem {
  type: 'header' | 'value';
  value: string | number;
  rowSpan?: number;
  visible: boolean;
  totalsLine: boolean;
}

interface GroupedData {
  grouped: Record<string, Record<string, any>>;
}

/**
 * Determines the visibility of an item based on its relationship to a previous item,
 * its partial key, and the count of occurrences of the partial key.
 *
 * @param previousItemSplit - An array of strings representing the split keys of the previous item,
 *                            or `null` if there is no previous item.
 * @param keyCounts - A record containing the count of occurrences for each key.
 * @param partialK - The partial key of the current item being checked.
 * @param prevK - The partial key of the previous item, or `null` if there is no previous item.
 * @returns `true` if the item should be visible, otherwise `false`.
 */
function checkVisibility(
  previousItemSplit: string[] | null, 
  keyCounts: Record<string, number>, 
  partialK: string, 
  prevK: string | null
): boolean {
  if (!previousItemSplit) {
    return true;
  } else if (partialK !== prevK) {
    return true;
  } else if (keyCounts[partialK] === 1) {
    return true;
  }
  return false;
}

/**
 * Generates a denormalized line item array based on the provided key, data, and configuration.
 *
 * @param key - The unique key representing the current line, potentially including subtotals suffix.
 * @param data - A record containing the data values for the current line.
 * @param previousItem - The key of the previous item, used to determine visibility of headers.
 * @param keyCounts - A record mapping keys to their respective row span counts.
 * @param valuesFields - An array of field names to extract values from the data object.
 * @param countObj - An object used to track the ranking count and the previous key for ranking purposes.
 * @param showRanking - Optional flag indicating whether to include ranking information in the line.
 * @returns An array of `LineItem` objects representing the denormalized line.
 */
function getDenormalizedLine(
  key: string, 
  data: Record<string, any>, 
  previousItem: string | null, 
  keyCounts: Record<string, number>, 
  valuesFields: string[], 
  countObj: CountObject, 
  showRanking?: boolean
): LineItem[] {
  const totalsLine = key.includes(subtotalsSuffix);
  const line: LineItem[] = [];

  const previousItemSplit = previousItem ? previousItem.split(separator) : null;
  const splitKey = key.split(separator);
  const splitKeyLength = splitKey.length;

  countObj.count++;

  for (let norm = 0; norm < splitKeyLength; norm++) {
    const partialK = splitKey.slice(0, norm + 1).join(separator);
    const prevK = previousItemSplit ? previousItemSplit.slice(0, norm + 1).join(separator) : null;

    line.push({
      type: 'header',
      value: splitKey[norm].replace(subtotalsSuffix, ''),
      rowSpan: keyCounts[partialK],
      visible: checkVisibility(previousItemSplit, keyCounts, partialK, prevK),
      totalsLine
    });

    if (showRanking && norm === splitKeyLength - 2) {
      if (countObj.prevKey !== partialK) {
        countObj.prevKey = partialK;
        countObj.count = 1;
      }
    }
  }

  // Inject Ranking if required
  if (showRanking) {
    const index = line.length - 1;
    line.splice(index, 0, {
      type: 'header',
      value: countObj.count,
      rowSpan: 1,
      visible: true,
      totalsLine
    });
  }

  // Add values
  valuesFields.forEach(v => {
    line.push({
      type: 'value',
      value: data[v],
      visible: true,
      totalsLine
    });
  });

  return line;
}


/**
 * This function is used to calculate how many rowSpan will be required
 * when generating the actual HTML table.
 *
 * @param sortedKeys - An array of strings representing sorted keys. Each key is expected
 * to be a concatenation of parts separated by a specific separator.
 * @returns A record of how many rowSpan will be required for each key.
 */
function getKeysCounts(sortedKeys: string[]): Record<string, number> {
  const keyCounts: Record<string, number> = {};
  const l = sortedKeys.length;

  for (let x = 0; x < l; x++) {
    const splitKey = sortedKeys[x].split(separator);
    const splitKeyLength = splitKey.length;

    for (let y = 0; y < splitKeyLength; y++) {
      const partialK = splitKey.slice(0, y + 1).join(separator);
      keyCounts[partialK] = keyCounts[partialK] ? keyCounts[partialK] + 1 : 1;
    }
  }

  return keyCounts;
}

/**
 * Transforms grouped data into a denormalized array of line items.
 *
 * @param groupedData - The grouped data object containing the data to be denormalized.
 * @param rows - An array of row keys used to structure the denormalized data.
 * @param orderBy - A string or array of strings specifying the order in which to sort the data.
 * @param showRanking - Optional boolean indicating whether to include ranking information in the output.
 * @returns A two-dimensional array of `LineItem` objects representing the denormalized data.
 */
export default function getDenormalized(
  groupedData: GroupedData, 
  rows: string[], 
  orderBy: any, 
  showRanking?: boolean
): LineItem[][] {
  const { grouped } = groupedData;

  const valuesFields = Array.from(
    new Set(Object.keys(grouped).map(x => Object.keys(grouped[x])).flat())
  );

  const denormalizedArray: LineItem[][] = [];
  const sortedKeys = getSortedKeys(grouped, rows, valuesFields, Array.isArray(orderBy) ? orderBy : []);
  const keyCounts = getKeysCounts(sortedKeys);
  const countObj: CountObject = { count: 0, prevKey: '' };

  sortedKeys.forEach((key, i) => {
    const previousItem = i > 0 ? sortedKeys[i - 1] : null;
    denormalizedArray.push(
      getDenormalizedLine(key, grouped[key], previousItem, keyCounts, valuesFields, countObj, showRanking)
    );
  });

  return denormalizedArray;
}