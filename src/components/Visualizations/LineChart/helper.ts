import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)',
];

interface PlotlyLineChartObjectProps {
  data: object[];
  dimensions: string[];
  xaxisField: string;
  xylegend: object;
  hoverFn?: (item: any) => string;
  hovertemplate?: string;
  hovertextfield?: string;
  colors?: string[];
  title?: string;
  width?: number;
  height?: number;
  defaultlegend?: boolean;
  hideLegend?: boolean;
  backgroundColor?: string;
  annotations?: object[];
}

export function getPlotlyLineCharttObject({
  data,
  dimensions,
  xaxisField,
  xylegend,
  hoverFn,
  hovertemplate,
  hovertextfield,
  colors,
  title,
  width,
  height,
  defaultlegend,
  hideLegend,
  backgroundColor,
  annotations,
}: PlotlyLineChartObjectProps): { data: any[]; layout: any } {
  const colorsToUse: string[] = colors || defaultColors;

  const getLineTrace = (dimension: string, i: number): any => {
    const baseTrace: any = {
      x: data.map((x: any) => x[xaxisField]),
      y: data.map((y: any) => y[dimension]),
      name: dimension,
      marker: {
        color: colorsToUse[i],
        width: 1,
      },
      showlegend: !hideLegend,
      type: 'scatter',
    };
    if (hoverFn) {
      return {
        ...baseTrace,
        text: data.map((item: any) => hoverFn(item)),
        hoverinfo: 'text',
      };
    } else if (hovertemplate && hovertextfield) {
      return {
        ...baseTrace,
        hovertemplate,
        text: data.map((item: any) => item[hovertextfield]),
        hoverinfo: 'text',
      };
    }
    return baseTrace;
  };

  const plotlyData: any[] = dimensions.map((dimension: string, i: number) =>
    getLineTrace(dimension, i)
  );

  const layout: any = getLayout({
    plotlyData,
    title,
    width,
    height,
    xylegend,
    defaultlegend,
    hideLegend,
    backgroundColor,
    annotations,
  });

  if (hoverFn) {
    layout.hovermode = 'closest';
    layout.hoverlabel = { bgcolor: '#FFF' };
  }

  return {
    data: plotlyData,
    layout,
  };
}
