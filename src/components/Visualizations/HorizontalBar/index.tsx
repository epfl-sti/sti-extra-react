import React from 'react';
import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { getPlotlyHBarObject } from './helper';
import PropTypes from 'prop-types';

interface PlotlyHorizontalBarProps {
  data: object;
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
  showText?: boolean;
  textSuffix?: string;
  textColor?: string;
  plotlyCdnSource?: string;
}

export const HorizontalBar: React.FC<PlotlyHorizontalBarProps> = ({
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
  showText,
  textSuffix,
  textColor,
  plotlyCdnSource,
}) => {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyHBarObject({
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
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
}

HorizontalBar.propTypes = {
  data: PropTypes.object,
  dimensions: PropTypes.array,
  labels: PropTypes.array,
  xylegend: PropTypes.object,
  colors: PropTypes.array,
  title: PropTypes.string,
  stacked: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  bottomLegend: PropTypes.string,
  showText: PropTypes.bool,
  textSuffix: PropTypes.string,
  textColor: PropTypes.string,
  plotlyCdnSource: PropTypes.string,
};
