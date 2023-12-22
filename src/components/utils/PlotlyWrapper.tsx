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

  const renderPlot = () => {

    const { data, layout } = jsonData;

    const getPlot = () => {

      console.log('Plot:', Plot)

      if (Plot.default) {
        return <Plot.default
        data={data}
        layout={layout}
        onRelayout={(e: any) => {
          if (relayOutHandler) {
            relayOutHandler(e);
          }
        }}
        config={{ displayModeBar: false }}
      />
      } else {
        return <Plot.default
        data={data}
        layout={layout}
        onRelayout={(e: any) => {
          if (relayOutHandler) {
            relayOutHandler(e);
          }
        }}
        config={{ displayModeBar: false }}
      />

      }

      
    };

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
      {jsonData  && renderPlot()}
    </div>
  );
};

PlotlyWrapper.propTypes = {
  jsonData: PropTypes.object,
  plotlyCdnSource: PropTypes.string,
};

export default PlotlyWrapper;
