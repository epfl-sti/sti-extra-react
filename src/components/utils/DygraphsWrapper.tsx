import PropTypes from 'prop-types';
import Dygraph from 'dygraphs';
import './dygraphs.css'
import { useState, useEffect } from 'react';

interface DygraphWrapperProps {
  data: any;
  options: any;
  bottomLegend: string;
  id?: string;
  annotations: any;
  dygraphsCdnSource: string;
}

const defaultOptions = {
  title: 'EPFL Time series',
  width: 850,
  height: 500,
  rollPeriod: 1,
  drawXAxis: 1,
  drawYAxis: 1,
  drawXGrid: 1,
  drawYGrid: 1,
  axisLineColor: '#ffffff',
  colors: ['#d70206', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#4D4D4D'],
  gridLineColor: '#FFF',
  gridColor: '#ddd',
  highlightCircleSize: 3,
  strokeWidth: 2,
  axes: {
    y: {
      axisLabelFormatter: (y: number) => {
        if (y > 999999) {
          return y / 1000000 + ' M';
        } else if (y > 999) {
          return y / 1000 + 'K';
        } else {
          return y.toString();
        }
      }
    }
  },
  underlayCallback: (canvas: CanvasRenderingContext2D) => {
    canvas.fillStyle = '#dedede';
    canvas.fillRect(0, 0, 2000, 2000);
  }
};

function convertArrayToText(data: any[]) {
  const header = Object.keys(data[0]).join(',');
  const values = data.map(item => Object.values(item).join(','));
  return [header, ...values].join('\n');
}

export default function DygraphWrapper({ data, options, bottomLegend, id, annotations }: DygraphWrapperProps) {
  const [domRefV, setDomRef] = useState(null)

  const graphId = id || 'graph';

  useEffect(() => {
    if (!domRefV) {
      const thisRef = document.getElementById(graphId);
      setDomRef(thisRef)  
    }
  }, [domRefV, graphId])

  const renderPlot = () => {
    try {
      const processedData = Array.isArray(data) ? convertArrayToText(data) : data;
      const optionsToUse = options.takeover
        ? options
        : {
            ...defaultOptions,
            ...options
          };
      const graph = new Dygraph(graphId, processedData, optionsToUse);
      if (annotations) {
        graph.ready(() => graph.setAnnotations(annotations));
      }
    } catch (e) {
      return <span style={{ fontSize: '1em', fontStyle: 'italic' }}>Not enough data or wrong data format. Unable to generate the graph</span>;
    }
  };

  const renderBottomLegend = () => <div style={{ padding: '1em', marginLeft: '2em', marginRight: '2em' }}>
    <small><i dangerouslySetInnerHTML={{ __html: bottomLegend }} /></small>
  </div>;

  return (
    <div>
      <div id={graphId} />
      <p>&nbsp;</p>
      {data && options && domRefV && renderPlot()}
      {bottomLegend && domRefV && renderBottomLegend()}
    </div>
  );
}

DygraphWrapper.propTypes = {
  jsonData: PropTypes.object
};
