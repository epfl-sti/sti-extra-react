import React from 'react';
import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { getPlotlyLineCharttObject } from './helper';
import PropTypes from 'prop-types';

interface PlotlyLineChartPlotProps {
  data?: any[];
  dimensions?: any[];
  xaxisField?: string;
  xylegend?: object;
  hoverFn?: any;
  hovertemplate?: string;
  hovertextfield?: string;
  colors?: any[];
  title?: string;
  width?: number;
  height?: number;
  defaultlegend?: boolean;
  hideLegend?: boolean;
  backgroundColor?: string;
  annotations?: any[];
  bottomLegend?: string;
  plotlyCdnSource?: string;
}

export const LineChartPlot: React.FC<PlotlyLineChartPlotProps> = ({
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
  bottomLegend,
  plotlyCdnSource,
}) => {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyLineCharttObject({
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
        hideLegend,
        defaultlegend,
        backgroundColor,
        annotations,
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
};

LineChartPlot.propTypes = {
  data: PropTypes.array,
  dimensions: PropTypes.array,
  xaxisField: PropTypes.string,
  xylegend: PropTypes.object,
  defaultlegend: PropTypes.bool,
  backgroundColor: PropTypes.string,
  colors: PropTypes.array,
  hoverFn: PropTypes.func,
  hovertextfield: PropTypes.string,
  hovertemplate: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  annotations: PropTypes.array,
  bottomLegend: PropTypes.string,
  plotlyCdnSource: PropTypes.string,
};
