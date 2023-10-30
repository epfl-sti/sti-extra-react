import { getLayout } from '../../utils/getPlotlyLayout'
import { getYearPercentage } from '../../utils/dateUtils';

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)'
];

interface PlotlyVBarObjectProps {
  data: Record<string, Record<string, number>>;
  dimensions: string[];
  labels: string[];
  xylegend: string;
  colors?: string[];
  title: string;
  stacked: boolean;
  barmode: string;
  width: number;
  height: number;
  hoverFn?: any;
  showlegend: boolean;
  annotations: any;
  averageLine: string | undefined;
  todayLine: boolean;
  ysuffix: string;
}

interface VBarTrace {
  y: number[];
  x: string[];
  name: string;
  showlegend: boolean;
  orientation: 'v';
  marker: {
    color: string;
    width: number;
  };
  line?: any;
  mode?: string;
  type: string;
  text?: string[];
  hoverinfo?: string;
  textposition?: string;
  textfont?: any; 
}

export function getPlotlyVBarObject({
  data,
  dimensions,
  labels,
  xylegend,
  colors,
  title,
  stacked,
  barmode,
  width,
  height,
  hoverFn,
  showlegend,
  annotations,
  averageLine,
  todayLine,
  ysuffix
}: PlotlyVBarObjectProps) {
  const colorsToUse = colors || defaultColors;
  let lineTrace: VBarTrace | undefined;
  let todayTrace: VBarTrace | undefined;

  // Generates an average line for the dimension defined in the 'averageLine' prop.
  function getAverageLineTrace(dimension: string): VBarTrace {
    const yItems = Object.keys(data).filter(
      yItem => data[yItem] && data[yItem][dimension]
    );
    const yValues = yItems.map(yItem => data[yItem][dimension]);
    const yAverage = parseInt(
      String(yValues.reduce((a, b) => a + b, 0) / yValues.length)
    );

    return {
      y: yItems.map(() => yAverage),
      x: yItems,
      name: `avg: ${yAverage}%`,
      type: 'scatter',
      mode: 'lines+text',
      showlegend: false,
      text: yItems.map((x, i) => (i === 2 ? `avg: ${yAverage}%` : '')),
      textposition: 'top right',
      textfont: {
        size: 10,
        color: '#333'
      },
      line: {
        color: '#000',
        width: 0.5
      },
      orientation: 'v',
      marker: {
        color: '',
        width: 0
      }
    };
  }

  // Generates an average line for the dimension defined in the 'averageLine' prop.
  function getTodayLineTrace(): VBarTrace {
    const yItems = Object.keys(data);
    const todayPerc = getYearPercentage();
    return {
      y: yItems.map(() => todayPerc),
      x: yItems,
      name: '% ellapsed time',
      type: 'scatter',
      showlegend: false,
      mode: 'lines+text',
      text: yItems.map((x, i) =>
        i === 1 ? '% Ellapsed since the beginning of the year' : ''
      ),
      textposition: 'top right',
      textfont: {
        size: 10,
        color: '#333'
      },
      line: {
        color: '#333',
        width: 0.5
      },
      orientation: 'v',
      marker: {
        color: '',
        width: 0
      }
    };
  }

  function getVBarTrace(dimension: string, i: number): VBarTrace {
    const yItems = Object.keys(data).filter(
      yItem => data[yItem] && data[yItem][dimension]
    );
    const basetrace: VBarTrace = {
      y: yItems.map(yItem => data[yItem][dimension]),
      x: yItems,
      name: labels[i],
      showlegend,
      orientation: 'v',
      marker: {
        color: colorsToUse[i],
        width: 1
      },
      type: 'bar'
    };

    if (hoverFn) {
      return {
        ...basetrace,
        text: yItems.map(item => hoverFn(data[item])),
        hoverinfo: 'text'
      };
    }
    return basetrace;
  }

  const plotlyData = dimensions.map((dimension, i) => {
    const trace = getVBarTrace(dimension, i);
    return trace;
  });

  if (averageLine) {
    lineTrace = getAverageLineTrace(averageLine);
  }

  if (todayLine) {
    todayTrace = getTodayLineTrace();
  }

  const layout = getLayout({
    plotlyData,
    title,
    width,
    height,
    xylegend,
    stacked,
    barmode,
    annotations,
    ysuffix
  });

  if (hoverFn) {
    layout.hovermode = 'closest';
    layout.hoverlabel = { bgcolor: '#FFF' };
  }

  function getFinalData(): (VBarTrace | undefined)[] {
    if (averageLine && todayLine) {
      return [...plotlyData, lineTrace, todayTrace];
    }
    if (averageLine) {
      return [...plotlyData, lineTrace];
    }
    if (todayLine) {
      return [...plotlyData, todayTrace];
    }
    return plotlyData;
  }

  return {
    data: getFinalData().filter(Boolean),
    layout
  };
}
