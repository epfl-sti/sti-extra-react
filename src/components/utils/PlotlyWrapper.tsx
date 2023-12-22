import React from 'react';
import './plotlys.css';
import Plot from 'react-plotly.js';

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

      if ((Plot as any).default !== undefined) {
        //@ts-expect-error import quirck
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
        return <Plot
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

export default PlotlyWrapper;
