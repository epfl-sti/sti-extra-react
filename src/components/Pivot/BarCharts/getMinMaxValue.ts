import * as d3 from 'd3';

export default function getMinMaxValues(pivotData: Array<Array<{ type: string; value: number }>>) {
  const flatData = pivotData
    .map(arr => arr.filter(x => x.type === 'value').map(x => x.value))
    .flat();

  return {
    calcMinValue: d3.min(flatData) ?? 0,
    calcMaxValue: d3.max(flatData) ?? 0,
  };
}
