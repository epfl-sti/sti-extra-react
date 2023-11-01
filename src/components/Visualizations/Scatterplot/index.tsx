import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { getPlotlyScatterPlotObject } from './helper';
import PropTypes from 'prop-types';

interface PlotlyScatterPlotProps {
  data?: any;
  tracesFields?: any;
  xylegend?: any;
  xaxisField?: any;
  yaxisField?: any;
  defaultlegend?: any;
  backgroundColor?: string;
  colors?: string[];
  colorsShapesMap?: any;
  hoverFn?: any;
  hovertextfield?: string;
  hovertemplate?: string;
  title?: string;
  width?: number;
  height?: number;
  annotations?: any[];
  bottomLegend?: string;
  plotlyCdnSource?: string;
}

export function ScatterPlot({
  data,
  tracesFields,
  xylegend,
  defaultlegend,
  backgroundColor,
  colors,
  colorsShapesMap,
  hoverFn,
  hovertextfield,
  hovertemplate,
  title,
  xaxisField,
  yaxisField,
  width,
  height,
  annotations,
  bottomLegend,
  plotlyCdnSource,
}: PlotlyScatterPlotProps) {
  const getChart = () => (
    <PlotlyWrapper
      jsonData={getPlotlyScatterPlotObject({
        data,
        tracesFields,
        xylegend,
        hoverFn,
        hovertemplate,
        hovertextfield,
        colors,
        colorsShapesMap,
        xaxisField,
        yaxisField,
        title,
        width,
        height,
        defaultlegend,
        backgroundColor,
        annotations
      })}
      bottomLegend={bottomLegend}
      plotlyCdnSource={plotlyCdnSource}
    />
  );

  return <div>{data && getChart()}</div>;
}

ScatterPlot.propTypes = {
  data: PropTypes.array,
  tracesFields: PropTypes.array,
  xylegend: PropTypes.object,
  defaultlegend: PropTypes.bool,
  backgroundColor: PropTypes.string,
  colors: PropTypes.array,
  colorsShapesMap: PropTypes.object,
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
