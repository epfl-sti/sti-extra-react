import React from 'react';
import PlotlyWrapper from '../../utils/PlotlyWrapper';
import { getPlotlyHboxPlotGrouppedObject } from './plotlyHorizontalBoxplotGroupedHelper';

interface PlotlyHorizontalBoxplotProps {
  data?: object;
  dimensions?: any[];
  labels?: any[];
  xylegend?: object;
  colors?: any[];
  colorsShapesMap?: { colors: {[key: string]: string }; shapes: {[key: string]: string }};
  stacked?: boolean;
  title?: string;
  width?: number;
  height?: number;
  bottomLegend?: string;
  plotlyCdnSource?: string;
}

export const HorizontalBoxplotGrouped: React.FC<PlotlyHorizontalBoxplotProps> = ({
  data,
  dimensions,
  labels,
  xylegend,
  colors,
  colorsShapesMap,
  stacked,
  title,
  width,
  height,
  bottomLegend,
  plotlyCdnSource,
}) => {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyHboxPlotGrouppedObject({
        data,
        dimensions,
        labels,
        xylegend,
        colors,
        colorsShapesMap,
        title,
        stacked,
        width,
        height,
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
};

