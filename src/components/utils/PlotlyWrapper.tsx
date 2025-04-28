import React from 'react';
import './plotlys.css';

// Import plotly core
import Plotly from 'plotly.js/lib/core';

// Import only the modules you need based on your chart types
import * as choropleth from 'plotly.js/lib/choropleth';
import * as bar from 'plotly.js/lib/bar';
import * as pie from 'plotly.js/lib/pie';
import * as scatter from 'plotly.js/lib/scatter';
import * as box from 'plotly.js/lib/box';

// Register the components
Plotly.register([
  choropleth,
  bar,
  pie,
  scatter,
  box
]);

// Use the factory method to create the Plot component
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

interface PlotlyWrapperProps {
  jsonData: {layout: any, data: any};
  bottomLegend?: string;
  relayOutHandler?: (e: any) => void;
  plotlyCdnSource?: string;
}

const PlotlyWrapper: React.FC<PlotlyWrapperProps> = ({
  jsonData,
  bottomLegend,
  relayOutHandler,
}) => {
  const renderPlot = () => {
    const { data, layout } = jsonData;
    
    const getPlot = () => {
      // The custom Plot component created with createPlotlyComponent
      // doesn't need the .default check anymore
      return (
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
      {jsonData && renderPlot()}
    </div>
  );
};

export default PlotlyWrapper;