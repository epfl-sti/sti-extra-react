import React from 'react';
import PropTypes from 'prop-types';
import { useExternalScript } from './useExternalScript';
import Spinner from './spinner';
import './plotlys.css';
import Plot from 'react-plotly.js';

interface PlotlyWrapperProps {
  jsonData: object;
  bottomLegend?: string;
  relayOutHandler?: (e: any) => void;
  plotlyCdnSource?: string;
}

let plotlyLoaded: boolean;

const PlotlyWrapper: React.FC<PlotlyWrapperProps> = ({
  jsonData,
  bottomLegend,
  relayOutHandler,
  plotlyCdnSource,
}) => {
  const extPlotlyLoaded = useExternalScript(
    plotlyCdnSource || 'https://cdn.plot.ly/plotly-latest.min.js'
  );

  console.log('PlotlyWrapper: extPlotlyLoaded', extPlotlyLoaded);
  console.log('PlotlyWrapper: plotlyLoaded', plotlyLoaded);
  

  if (!plotlyLoaded) {
    plotlyLoaded = extPlotlyLoaded;
  }

  const renderPlot = () => {

    const { data, layout } = jsonData;

    const getPlot = () => (
      <Plot
        data={data}
        layout={layout}
        onRelayout={(e: any) => {
          if (relayOutHandler) {
            relayOutHandler(e);
          }
        }}
        config={{ displayModeBar: false }}
      />
    );

    return bottomLegend ? (
      <div>
        {getPlot()}
        <div style={{ padding: '1em', marginLeft: '2em', marginRight: '2em' }}>
          <small>
            <i dangerouslySetInnerHTML={{ __html: bottomLegend }} />
          </small>
        </div>
      </div>
    ) : (
      getPlot()
    );
  };

  return (
    <div>
      {!plotlyLoaded && <Spinner />}
      {jsonData && plotlyLoaded && renderPlot()}
    </div>
  );
};

PlotlyWrapper.propTypes = {
  jsonData: PropTypes.object,
  plotlyCdnSource: PropTypes.string,
};

export default PlotlyWrapper;
