import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)'
];

interface PlotlyHboxPlotObjectProps {
  data: { [key: string]: any };
  dataKeys?: string[];
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
  dataKeys,
  xylegend,
  colors,
  title,
  width,
  height,
}: PlotlyHboxPlotObjectProps) {
  const colorsToUse: string[] = colors || defaultColors;

  const keys = dataKeys ? dataKeys.reverse() : Object.keys(data);

  const plotlyData = keys.filter((x) => data[x] && data[x][dimensions[0]])
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