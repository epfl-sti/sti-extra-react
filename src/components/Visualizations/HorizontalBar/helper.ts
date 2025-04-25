import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)'
];

interface PlotlyHBarObjectProps {
  data: any;
  dataKeys?: string[];
  dimensions: any[];
  labels: any[];
  xylegend: any;
  colors: any[];
  title: string;
  stacked: boolean;
  width: number;
  height: number;
  showText: boolean;
  textSuffix: string;
  textColor: string;
}

export function getPlotlyHBarObject({
  data,
  dataKeys,
  dimensions,
  labels,
  xylegend,
  colors,
  title,
  stacked,
  width,
  height,
  showText,
  textSuffix,
  textColor,
}: PlotlyHBarObjectProps) {
  const colorsToUse = colors || defaultColors;
  console.log({data})

  const plotlyData = dimensions.map((dimension: any, i: number) => {
    const keys = dataKeys ? dataKeys : Object.keys(data);
    const yItems = keys.filter(
      (yItem) => data[yItem] && data[yItem][dimension]
    );
    console.log({yItems})
    const baseTrace = {
      x: yItems.map((yItem) => data[yItem][dimension]),
      y: yItems,
      name: labels[i],
      orientation: 'h',
      showlegend: true,
      marker: {
        color: colorsToUse[i],
        width: 1,
      },
      type: 'bar',
    };
    if (!showText) {
      return baseTrace;
    }
    return {
      ...baseTrace,
      text: baseTrace.x.map((x) => `${String(x)}${textSuffix || ''}   `),
      textfont: {
        color: textColor || '#eee',
      },
      hoverinfo: 'text',
      textposition: 'auto',
    };
  });

  const layout = getLayout({
    plotlyData,
    title,
    width,
    height,
    xylegend,
    stacked,
  });

  return {
    data: plotlyData,
    layout,
  };
}
