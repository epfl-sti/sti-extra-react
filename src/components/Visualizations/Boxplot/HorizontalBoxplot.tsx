import React from 'react';
import PlotlyWrapper from '../../utils/PlotlyWrapper';
import { getPlotlyHboxPlotObject } from './plotlyHorizontalBoxplotHelper';
import PropTypes from 'prop-types';

interface PlotlyHorizontalBoxplotProps {
  data?: object;
  dataKeys?: string[];
  dimensions?: any[];
  labels?: any[];
  xylegend?: object;
  colors?: any[];
  stacked?: boolean;
  title?: string;
  width?: number;
  height?: number;
  bottomLegend?: string;
  plotlyCdnSource?: string;
}

export const HorizontalBoxplot: React.FC<PlotlyHorizontalBoxplotProps> = ({
  data,
  dataKeys,
  dimensions,
  labels,
  xylegend,
  colors,
  stacked,
  title,
  width,
  height,
  bottomLegend,
  plotlyCdnSource,
}) => {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyHboxPlotObject({
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
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
};

HorizontalBoxplot.propTypes = {
  data: PropTypes.object,
  dataKeys: PropTypes.array,
  dimensions: PropTypes.array,
  labels: PropTypes.array,
  xylegend: PropTypes.object,
  colors: PropTypes.array,
  title: PropTypes.string,
  stacked: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  bottomLegend: PropTypes.string,
  plotlyCdnSource: PropTypes.string,
};

