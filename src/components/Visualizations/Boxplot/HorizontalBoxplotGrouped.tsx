import React from 'react';
import PlotlyWrapper from '../../utils/PlotlyWrapper';
import { getPlotlyHboxPlotGrouppedObject } from './plotlyHorizontalBoxplotGroupedHelper';
import PropTypes from 'prop-types';

interface PlotlyHorizontalBoxplotProps {
  data?: object;
  dimensions?: any[];
  labels?: any[];
  xylegend?: object;
  colors?: any[];
  colorsShapesMap?: any[];
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

HorizontalBoxplotGrouped.propTypes = {
  data: PropTypes.object,
  dimensions: PropTypes.array,
  labels: PropTypes.array,
  xylegend: PropTypes.object,
  colors: PropTypes.array,
  colorsShapesMap: PropTypes.array,
  title: PropTypes.string,
  stacked: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  bottomLegend: PropTypes.string,
  plotlyCdnSource: PropTypes.string,
};

