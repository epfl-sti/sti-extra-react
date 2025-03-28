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
  showBarValues: boolean;
  barValuesSuffix: string;
  usePercentages: boolean;
};

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
      d3chartBuilder(svg, builtDataObjectWithX, showBarValues, barValuesSuffix, true);
    },
    [dataElement]
  );

  return (
    <svg
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
