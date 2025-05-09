import { nanoid } from 'nanoid';
import useD3 from './d3hook';
import d3chartBuilder from './d3chartBuilder';

type StackChartProps = {
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
 * A React functional component that renders a stacked bar chart using D3.js.
 *
 * @param {StackChartProps} props - The properties object for the StackChart component.
 * @param {Record<string, number>} props.dataElement - The data object containing values for each dimension.
 * @param {number} props.maxValue - The maximum value for the chart, used to calculate bar widths.
 * @param {number} [props.minValue] - The minimum value for the chart, used for adjusting the x-axis.
 * @param {string[]} props.dimensions - An array of dimension keys to extract data from `dataElement`.
 * @param {string[]} [props.colors] - An optional array of colors for the bars. Defaults to a predefined set of colors.
 * @param {number} [props.height=30] - The height of the bars in the chart. Defaults to 30.
 * @param {boolean} props.showBarValues - A flag indicating whether to display values on the bars.
 * @param {string} [props.barValuesSuffix] - An optional suffix to append to the bar values (e.g., '%').
 * @param {boolean} props.usePercentages - A flag indicating whether to display values as percentages.
 *
 * @returns {JSX.Element} A scalable vector graphic (SVG) element containing the stacked bar chart.
 *
 */
export default function StackChart({
  dataElement,
  maxValue,
  minValue,
  dimensions,
  colors,
  height = 30,
  showBarValues,
  barValuesSuffix,
  usePercentages,
}: StackChartProps) {
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

  const chartColors = colors || ['#4e79a7', '#e05759', '#f28e2c'];
  const builtDataObject = dimensions.map((x, i) => ({
    dimension: x,
    y: 0,
    text: `${Math.round(dataElement[x])}${suffix}`,
    width: getWidth(dataElement[x]),
    height,
    color: chartColors[i] || randomColor(),
  }));

  const widths = builtDataObject.map((x) => x.width);
  const builtDataObjectWithX = builtDataObject.map((item, index) => ({
    ...item,
    x:
      index === 0
        ? getAdjustedX(0)
        : getAdjustedX(widths.slice(0, index).reduce((a, b) => a + b, 0)),
  }));

  const ref = useD3(
    (svg) => {
      svg.selectAll('*').remove();
      // @ts-ignore. It needs the additional anonymous function to work.
      d3chartBuilder(svg, builtDataObjectWithX, showBarValues, barValuesSuffix);
    },
    [dataElement]
  );

  return (
    <svg
      // @ts-ignore. This is a valid ref
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
