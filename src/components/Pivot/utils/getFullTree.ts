import { separator } from './settings';

interface GroupedData {
  grouped: Record<string, any>;
}


/**
 * Sets a nested value in an object based on a dot-separated path.
 *
 * @param obj - The object in which the value will be set.
 * @param path - A dot-separated string representing the path to the nested property.
 * @param value - The value to set at the specified path.
 *
 */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Transforms a grouped data structure into a nested object representation.
 *
 * @param groupedData - The input data containing a `grouped` property, where keys are
 *                      delimited strings and values are the corresponding data.
 * @returns A nested object where the keys are derived from the delimited strings
 *          in the `grouped` property, and the values are the corresponding data.
 *
 * @remarks
 * The function uses a separator to split the keys in the `grouped` property and
 * constructs a nested object by setting values at the appropriate paths.
 * ```
 */
export default function getFullTree(groupedData: GroupedData): Record<string, any> {
  const finalObj: Record<string, any> = {};
  const { grouped } = groupedData;

  Object.keys(grouped).forEach(thisKey => {
    const dotKey = thisKey.split(separator).join('.');
    setNestedValue(finalObj, dotKey, grouped[thisKey]);
  });

  return finalObj;
}