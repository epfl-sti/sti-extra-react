import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)'
];

interface PlotlyHboxPlotObjectProps {
  data: { [key: string]: any };
  dimensions: string[];
  xylegend: any;
  colors?: string[];
  labels?: any;
  stacked?: boolean;
  title: string;
  width: number;
  height: number;
}

export function getPlotlyHboxPlotObject({
  data,
  dimensions,
  xylegend,
  colors,
  title,
  width,
  height,
}: PlotlyHboxPlotObjectProps) {
  const colorsToUse: string[] = colors || defaultColors;

  const plotlyData = Object.keys(data)
    .filter((x) => data[x] && data[x][dimensions[0]])
    .map((x, i) => ({
      x: data[x][dimensions[0]],
      marker: { color: colorsToUse[i] },
      name: x,
      boxpoints: false,
      type: 'box',
    }));

  const layout = getLayout({ plotlyData, title, width, height, xylegend });

  return {
    data: plotlyData,
    layout,
  };
}