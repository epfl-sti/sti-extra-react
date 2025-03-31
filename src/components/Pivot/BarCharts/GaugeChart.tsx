import useD3 from './d3hook';
import d3chartBuilder from './d3chartBuilder';
import { nanoid } from 'nanoid';

type GaugeChartProps = {
  dataElement: Record<string, number>;
  maxValue: number;
  minValue: number;
  dimensions: string[];
  colors?: string[];
  height?: number;
  showBarValues?: boolean;
  barValuesSuffix?: string;
  usePercentages?: boolean;
};

/**
 * A React functional component that renders a gauge chart using D3.js.
 * The chart visualizes data as horizontal bars with customizable dimensions, colors, and values.
 *
 * @param {GaugeChartProps} props - The properties for the GaugeChart component.
 * @param {Record<string, number>} props.dataElement - An object containing the data values for each dimension.
 * @param {number} props.maxValue - The maximum value for the chart, used to calculate bar widths.
 * @param {number} props.minValue - The minimum value for the chart, used to adjust bar positions.
 * @param {string[]} props.dimensions - An array of dimension keys to extract data from `dataElement`.
 * @param {string[]} [props.colors] - An optional array of colors for the bars. Defaults to a predefined color palette.
 * @param {number} [props.height=30] - The height of the chart. Defaults to 30.
 * @param {boolean} props.showBarValues - Whether to display values on the bars.
 * @param {string} props.barValuesSuffix - A suffix to append to the bar values (e.g., '%').
 * @param {boolean} props.usePercentages - Whether to display values as percentages.
 *
 * @returns {JSX.Element} A scalable vector graphic (SVG) element containing the gauge chart.
 */
export default function GaugeChart({
  dataElement,
  maxValue,
  minValue,
  dimensions,
  colors,
  height = 30,
  showBarValues,
  barValuesSuffix,
  usePercentages,
}: GaugeChartProps) {
  const suffix = usePercentages ? '%' : '';
  
  const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  
  const getWidth = (val: number) => (val * 100) / maxValue;
  
  const values = dimensions.map((x) => dataElement[x]);

  function getAdjustedX(val: number) {
    if (!minValue || minValue > 0) {
      return val;
    }
    if (values.includes(minValue)) {
      return val;
    }
    return val + Math.abs(minValue);
  }

  const yOffset = height / 3 / 2.3;
  const innerHeight = (height / 3) * 2;

  const chartColors = colors || ['#4e79a7', '#e05759', '#f28e2c'];
  const builtDataObject = dimensions.map((x, i) => ({
    dimension: x,
    y: i === 0 ? 0 : yOffset,
    text: `${dataElement[x]}${suffix}`,
    width: getWidth(dataElement[x]),
    height: i === 0 ? height : innerHeight,
    color: chartColors[i] || randomColor(),
  }));

  const widths = builtDataObject.map((x) => x.width);
  const builtDataObjectWithX = builtDataObject.map((item, index) => ({
    ...item,
    x:
      index <= 1
        ? getAdjustedX(0)
        : getAdjustedX(widths.slice(1, index).reduce((a, b) => a + b, 0)),
  }));

  const ref = useD3(
    (svg) => {
      svg.selectAll('*').remove();
      // @ts-ignore. It needs the additional anonymous function to work.
      d3chartBuilder(svg, builtDataObjectWithX, showBarValues, barValuesSuffix, true);
    },
    [dataElement]
  );

  return (
    <svg
      // @ts-ignore. THis is a valid ref
      ref={ref}
      key={nanoid()}
      style={{
        height,
        width: '100%',
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '0px',
      }}
    />
  );
}
