import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { getPieChartObject } from './helper';

interface PieChartProps {
    data?: any;
    labels?: any;
    colors?: any;
    title?: string;
    width?: number;
    height?: number;
    textinfo?: string;
    textposition?: string;
    hoverFn?: (args: [string, number]) => string;
    bottomLegend?: string;
    plotlyCdnSource?: string;
  }

  export function PieChart({
    data,
    labels,
    colors,
    title,
    width,
    height,
    textinfo,
    textposition,
    hoverFn,
    bottomLegend,
    plotlyCdnSource
  }: PieChartProps) {

    const getChart = () => (
        <PlotlyWrapper
          jsonData={getPieChartObject({
            data,
            labels,
            colors,
            title,
            width,
            height,
            textinfo,
            textposition,
            hoverFn
          })}
          bottomLegend={bottomLegend}
          plotlyCdnSource={plotlyCdnSource}
        />
      );
    
      return (
        <div>
          {data && getChart()}
        </div>
      );
  }