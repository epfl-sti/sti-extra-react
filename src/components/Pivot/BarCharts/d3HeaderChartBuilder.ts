import queue from 'queue';

const q = new queue();
q.concurrency = 150;
q.autostart = true;

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
