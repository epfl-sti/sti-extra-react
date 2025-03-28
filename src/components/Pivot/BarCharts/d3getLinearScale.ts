import * as d3 from 'd3';

function defaultFormatter(x: number): string | number {
  if (x > 1000000) {
    return `${(x / 1000000).toFixed(2)} M`;
  } else if (x > 1000) {
    return `${(x / 1000).toFixed(2)} k`;
  }
  // Avoid many decimal points in the legend.
  return Math.round(x) === x ? x : x.toFixed(2);
}

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
