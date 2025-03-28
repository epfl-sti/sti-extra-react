import { separator, subtotalsSuffix } from './settings';
import sortArray from 'sort-array';

type OrderDirection = 'asc' | 'desc';

interface OrderByItem {
  field: string;
  order: OrderDirection;
}

interface KeyObject {
  [key: string]: string | number;
}

const possibleOrder: OrderDirection[] = ['asc', 'desc'];

/**
 * Combines two arrays of key objects, `sortedKeys` and `subtotalKeys`, into a single array.
 * The function ensures that subtotal keys are inserted into the final array at appropriate positions
 * based on the comparison values extracted from the key objects.
 *
 * @param sortedKeys - An array of key objects that are sorted in a specific order.
 * @param subtotalKeys - An array of key objects representing subtotal entries.
 * @returns A new array of key objects that includes the original sorted keys and the subtotal keys
 *          inserted at the correct positions.
 *
 * The function works as follows:
 * - Iterates through the `sortedKeys` array.
 * - Compares the current key's value with the previous key's value.
 * - If the values differ, it attempts to find a matching subtotal key from `subtotalKeys` for the previous value
 *   and inserts it into the final array.
 * - Always appends the current key to the final array.
 * - At the end of the iteration, it checks for a matching subtotal key for the last key's value and appends it if found.
 *
 * The comparison value for each key object is extracted using the first property of the object.
 */
function combineSortedKeysWithSubtotalKeys(
  sortedKeys: KeyObject[], 
  subtotalKeys: KeyObject[]
): KeyObject[] {
  const extractComparisonValue = (keyObj: KeyObject): string | number => 
    keyObj[Object.keys(keyObj)[0]];

  const finalKeys: KeyObject[] = [];
  const sortedKeysLength = sortedKeys.length;

  sortedKeys.forEach((keyObj, i) => {
    if (i === 0) {
      finalKeys.push(keyObj);
      return;
    }

    const previousValue = extractComparisonValue(sortedKeys[i - 1]);
    const thisValue = extractComparisonValue(keyObj);

    if (thisValue !== previousValue) {
      const subtotalKey = subtotalKeys.find(
        x => extractComparisonValue(x) === previousValue
      );
      if (subtotalKey) finalKeys.push(subtotalKey);
    }

    finalKeys.push(keyObj);

    if (i === sortedKeysLength - 1) {
      const subtotalKey = subtotalKeys.find(
        x => extractComparisonValue(x) === thisValue
      );
      if (subtotalKey) finalKeys.push(subtotalKey);
    }
  });

  return finalKeys;
}

function orderByReducer(orderBy: OrderByItem[]): { [key: string]: OrderDirection } {
  return orderBy
    .filter(x => possibleOrder.includes(x.order))
    .reduce((obj, item) => {
      obj[item.field] = item.order;
      return obj;
    }, {} as { [key: string]: OrderDirection });
}

function getSortableKeyRows(
  keys: string[], 
  grouped: { [key: string]: { [key: string]: string | number } }, 
  rows: string[]
): KeyObject[] {
  // Get the k, v but making sure they are cast as numbers
  const values = keys.map(key => grouped[key]).map(obj => 
    Object.keys(obj).reduce((iobj, key) => {
      const value = obj[key];
      iobj[key] = typeof value === 'number' 
        ? value 
        : Number(String(value).replace(/[^0-9.]/g, ''));
      return iobj;
    }, {} as { [key: string]: number })
  );

  const keysRows = keys.map((key, i) => {
    const outerObj = key.split(separator)
      .reduce((obj, k, index) => {
        obj[rows[index]] = k;
        return obj;
      }, {} as { [key: string]: string });

    return {
      ...outerObj,
      ...values[i]
    };
  });

  return keysRows;
}

/**
 * Sorts and returns an array of keys from a grouped object based on specified rows, 
 * value fields, and optional order-by directives.
 *
 * @param grouped - An object where keys represent group identifiers and values are objects 
 * containing string or numeric data.
 * @param rows - An array of strings representing the row fields used for grouping.
 * @param valuesFields - An array of strings representing the fields containing values 
 * to be considered for sorting.
 * @param orderBy - An optional array of `OrderByItem` objects specifying the sorting 
 * directives for the fields. Defaults to an empty array.
 * 
 * @returns An array of sorted keys as strings.
 */
export default function getSortedKeys(
  grouped: { [key: string]: { [key: string]: string | number } }, 
  rows: string[], 
  valuesFields: string[], 
  orderBy: OrderByItem[] = []
): string[] {
  // If there is not a 'order by' directive let's not waste time and return
  // default asc order.
  const keysAll = Object.keys(grouped);
  if (orderBy.length === 0) {
    return keysAll.sort();
  }

  const keys = keysAll.filter(x => !x.includes(subtotalsSuffix));
  const keysWithSubtotals = keysAll.filter(x => x.includes(subtotalsSuffix));

  // Reduces the 'orderBy' directives into an Object
  const orderByObj = orderByReducer(orderBy);

  // Splits the keys into a sortable array of objects.
  const keysRows = getSortableKeyRows(keys, grouped, rows);

  // Splits also the keys with subtotals into a sortable array of objects.
  const keyRowsWithSubtotals = keysWithSubtotals.length === 0
    ? []
    : getSortableKeyRows(keysWithSubtotals, grouped, rows);

  // It needs some mandatory sort fields for the grouping, the others are optional.
  const mandatory = rows.slice(0, (rows.length - 1));
  const optional = [
    ...rows.slice(rows.length - 1), 
    ...valuesFields
  ].filter(field => orderByObj[field]);

  const orderFields = [...mandatory, ...optional];

  // Create the sort object configuration to pass to sortArray
  const sortArrayObj = {
    by: orderFields,
    order: orderFields.map(x => orderByObj[x] || 'asc')
  };

  const sortedKeysRows = sortArray(keysRows, sortArrayObj);

  // Adding back subtotals keys if necessary
  const finalSortedKeyRows = keyRowsWithSubtotals.length === 0
    ? sortedKeysRows
    : combineSortedKeysWithSubtotalKeys(sortedKeysRows, keyRowsWithSubtotals);

  // Compose back the sorted keys.
  const sortedKeys = finalSortedKeyRows.map(x =>
    Object.keys(x)
      .slice(0, rows.length)
      .map(v => x[v])
      .join(separator)
  );

  return sortedKeys;
}