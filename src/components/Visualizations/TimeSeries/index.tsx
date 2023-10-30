import DygraphWrapper from '../../utils/DygraphsWrapper';

interface TimeSeriesPlotProps {
  data?: any;
  options?: any;
  bottomLegend?: string;
  annotations?: any;
  dygraphsCdnSource?: string;
}

export function TimeSeriesPlot({
  data,
  options,
  bottomLegend,
  annotations,
  dygraphsCdnSource,
}: TimeSeriesPlotProps) {
  const getChart = () => (
    <DygraphWrapper
      data={data}
      options={options}
      bottomLegend={bottomLegend}
      annotations={annotations}
      dygraphsCdnSource={dygraphsCdnSource}
    />
  );

  return (
    <div>
      {data && getChart()}
    </div>
  );
}
