import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { getPlotlyVBarObject } from './helper';

interface VerticalBarProps {
  data: any;
  dimensions?: string[];
  labels?: string[];
  xylegend?: any;
  colors?: string[];
  title?: string;
  stacked?: boolean;
  barmode?: string;
  width?: number;
  height?: number;
  hoverFn?: (data: any) => string;
  annotations?: any;
  showlegend?: boolean;
  averageLine?: string | undefined;
  todayLine?: boolean;
  ysuffix?: string;
  bottomLegend?: string;
  plotlyCdnSource?: string;
}

export function VerticalBar({
  data,
  dimensions,
  labels,
  xylegend,
  colors,
  title,
  stacked,
  barmode,
  width,
  height,
  hoverFn,
  annotations,
  showlegend,
  averageLine,
  todayLine,
  ysuffix,
  bottomLegend,
  plotlyCdnSource,
}: VerticalBarProps) {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyVBarObject({
        data,
        dimensions,
        labels,
        xylegend,
        colors,
        title,
        stacked,
        barmode,
        width,
        height,
        hoverFn,
        annotations,
        showlegend,
        averageLine,
        todayLine,
        ysuffix,
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
}
