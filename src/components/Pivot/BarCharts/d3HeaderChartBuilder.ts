import PQueue from 'p-queue';
import * as d3 from 'd3';

const q = new PQueue({ concurrency: 150, autoStart: true });

/**
 * Sets the concurrency level for the D3 builder queue.
 *
 * @param concurrency - The maximum number of concurrent tasks allowed in the queue.
 */
export function setD3BuilderConcurrency(concurrency: number): void {
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
 */
export default function d3HeaderChartBuilder(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: ChartData[],
  showBarValues: boolean
): void {
  q.add(async () => {
    svg
      .selectAll<SVGRectElement, ChartData>('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', d => (!isNaN(d.width) ? `${d.width}%` : '0%'))
      .attr('x', d => `${d.x}%`)
      .attr('fill', d => d.color)
      .attr('y', d => d.y)
      .attr('height', d => d.height);

    if (showBarValues) {
      svg
        .selectAll<SVGTextElement, ChartData>('text')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.text)
        .attr('text-anchor', 'middle')
        .attr('x', d => `${d.textX ?? d.x + d.width / 2}%`)
        .attr('y', d => d.y + 10)
        .attr('font-size', d => d.fontSize || '11px')
        .attr('fill', d => d.fontColor || 'white');
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  });
}
