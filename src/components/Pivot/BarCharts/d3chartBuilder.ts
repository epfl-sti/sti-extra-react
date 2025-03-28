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

export function setD3BuilderConcurrency(concurrency: number): void {
  q.concurrency = concurrency;
}

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
