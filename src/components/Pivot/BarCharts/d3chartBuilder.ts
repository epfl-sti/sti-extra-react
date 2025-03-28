import queue from 'queue';
import * as d3 from 'd3';

interface ChartData {
  width: number;
  x: number;
  color: string;
  y: number;
  height: number;
  text: string;
  fontSize?: string;
  fontColor?: string;
}

const q = new queue();
q.concurrency = 150;
q.autostart = true;

/**
 * Sets the concurrency level for the D3 chart builder.
 *
 * @param concurrency - The maximum number of concurrent tasks allowed.
 */
export function setD3BuilderConcurrency(concurrency: number): void {
  q.concurrency = concurrency;
}

/**
 * Builds a D3 chart by appending and configuring SVG elements based on the provided data.
 *
 * @param svg - A D3 selection of an SVG group element (`<g>`) where the chart will be rendered.
 * @param data - An array of `ChartData` objects representing the data to be visualized.
 * @param showBarValues - A boolean indicating whether to display text values on the bars.
 * @param labelsSuffix - An optional string to append as a suffix to the bar values. Defaults to an empty string.
 * @param isGaugeChart - A boolean indicating whether the chart is a gauge chart. Defaults to `false`.
 *
 * The function dynamically appends `rect` and `text` elements to the provided SVG group element
 * based on the data. It supports two modes:
 * - Bar chart mode: Displays bars with optional text values.
 * - Gauge chart mode: Displays gauge-like bars with optional text values positioned differently.
 *
 * The function uses a queue (`q`) to manage asynchronous rendering and ensures a delay of 50ms
 * before invoking the callback to allow for rendering completion.
 */
export default function d3chartBuilder(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ChartData[],
  showBarValues: boolean,
  labelsSuffix: string = '',
  isGaugeChart: boolean = false
): void {
  q.push(function (cb: () => void) {
    svg
      .selectAll<SVGRectElement, ChartData>('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', d => (isNaN(d.width) ? '0%' : `${d.width}%`))
      .attr('x', d => `${d.x}%`)
      .attr('fill', d => d.color)
      .attr('y', d => d.y)
      .attr('height', d => d.height);

    if (showBarValues && !isGaugeChart) {
      svg
        .selectAll<SVGTextElement, ChartData>('text')
        .data(data)
        .enter()
        .append('text')
        .text(d => `${d.text}${labelsSuffix}`)
        .attr('text-anchor', 'middle')
        .attr('x', d => `${d.width - (d.text.length + labelsSuffix.length) * 0.5}%`)
        .attr('y', d => d.y + 11)
        .attr('font-size', d => d.fontSize || `${d.height - 4}px`)
        .attr('fill', d => d.fontColor || 'white');
    }

    if (showBarValues && isGaugeChart) {
      svg
        .selectAll<SVGTextElement, ChartData>('text')
        .data(data)
        .enter()
        .append('text')
        .text((d, i) => (i > 0 ? `${d.text}${labelsSuffix}` : ''))
        .attr('text-anchor', 'middle')
        .attr('x', (d, i) => {
          const pos = d.width - ((d.text.length + labelsSuffix.length) * (d.height * 0.4)) / 10;
          return pos < 1.5 ? '-50%' : `${pos}%`;
        })
        .attr('y', d => d.y + d.height * 0.85)
        .attr('font-size', d => d.fontSize || `${d.height * 0.95}px`)
        .attr('fill', d => d.fontColor || 'white');
    }

    setTimeout(cb, 50);
  });
}
