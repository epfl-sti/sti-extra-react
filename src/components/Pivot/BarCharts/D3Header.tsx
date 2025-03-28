import useD3 from './d3hook';
import { nanoid } from 'nanoid';
import d3HeaderChartBuilder from './d3HeaderChartBuilder';

interface D3HeaderProps {
  height?: number;
  legendValues: string[];
}

/**
 * A React functional component that renders a D3-based header chart within an SVG element.
 * The chart is dynamically built using the provided legend values and height.
 *
 * @param {D3HeaderProps} props - The properties for the D3Header component.
 * @param {number} [props.height=16] - The height of the SVG element and chart bars.
 * @param {string[]} props.legendValues - An array of legend values used to build the chart.
 *
 * @returns {JSX.Element} A rendered SVG element containing the D3 chart.
 *
 */
export default function D3Header({ height = 16, legendValues }: D3HeaderProps) {
  const stepValue = 100 / (legendValues.length - 1);
  const getWidth = (i: number) => stepValue * i;

  const builtDataObject = legendValues.map((x, i) => ({
    dimension: x,
    text: x,
    y: 0,
    width: i === 0 ? 0 : getWidth(i),
    x: 0,
    textX: i === 0 ? 0 : getWidth(i),
    height,
    color: 'transparent',
    fontColor: '#495057',
  }));

  const ref = useD3(
    (svg) => {
      svg.selectAll('*').remove();
      // @ts-ignore. It needs the additional anonymous function to work.
      d3HeaderChartBuilder(svg, builtDataObject, true, () => {});
    },
    [legendValues]
  );

  return (
    <svg
      className="svgHeader"
      ref={ref}
      key={nanoid()}
      style={{
        height,
        width: '100%',
        marginTop: 0,
        marginRight: 0,
        marginLeft: 0,
      }}
    />
  );
}
