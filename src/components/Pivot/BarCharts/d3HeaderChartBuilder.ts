import queue from 'queue';

const q = new queue();
q.concurrency = 150;
q.autostart = true;

/**
 * Sets the concurrency level for the D3 builder queue.
 *
 * @param concurrency - The maximum number of concurrent tasks allowed in the queue.
 */
export function setD3BuilderConcurrency(concurrency: number) {
  q.concurrency = concurrency;
}

interface ChartData {
  text: string;
  width: number;
  x: number;
  y: number;
  height: number;
  color: string;
  textX?: number;
  fontSize?: string;
  fontColor?: string;
}

/**
 * Builds a D3 header chart by appending rectangles and optional text elements to the provided SVG element.
 *
 * @param svg - A D3 selection of an SVG element where the chart will be rendered.
 * @param data - An array of chart data objects, each containing properties for rendering rectangles and text.
 * @param showBarValues - A boolean indicating whether to display text values on the bars.
 *
 * The `data` array should contain objects with the following properties:
 * - `width` (number): The width of the rectangle as a percentage.
 * - `x` (number): The x-coordinate of the rectangle as a percentage.
 * - `y` (number): The y-coordinate of the rectangle.
 * - `height` (number): The height of the rectangle.
 * - `color` (string): The fill color of the rectangle.
 * - `text` (string, optional): The text to display on the bar.
 * - `textX` (number, optional): The x-coordinate for the text as a percentage. Defaults to a calculated value.
 * - `fontSize` (string, optional): The font size of the text. Defaults to '11px'.
 * - `fontColor` (string, optional): The color of the text. Defaults to 'white'.
 *
 * The function queues the rendering logic and executes it asynchronously with a slight delay.
 */
export default function d3HeaderChartBuilder(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: ChartData[],
  showBarValues: boolean
) {
  q.push(function (cb) {
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', (d) => `${d.width}%`)
      .attr('x', (d) => `${d.x}%`)
      .attr('fill', (d) => d.color)
      .attr('y', (d) => d.y)
      .attr('height', (d) => d.height);

    if (showBarValues) {
      svg
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text((d) => d.text)
        .attr('text-anchor', 'middle')
        .attr('x', (d) => `${d.textX ?? d.width - (d.text.length + 15)}%`)
        .attr('y', (d) => d.y + 10)
        .attr('font-size', (d) => d.fontSize || '11px')
        .attr('fill', (d) => d.fontColor || 'white');
    }
    setTimeout(function () {
      cb();
    }, 50);
  });
}
