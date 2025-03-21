import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors: string[] = [
    'rgba(55,128,191,0.6)',
    'rgba(255,153,51,0.6)'
  ];
  
  interface ScatterPlotTraceProps {
    x: any[];
    y: any[];
    name: string;
    color: string;
    symbol: string;
    hoverFn?: any;
    hovertemplate?: string;
    hovertextfield?: string;
    filteredData: any[];
  }
  
  function getScatterPlotTrace({
    x,
    y,
    name,
    color,
    symbol,
    hoverFn,
    hovertemplate,
    hovertextfield,
    filteredData,
  }: ScatterPlotTraceProps) {
    const baseObj = {
      x,
      y,
      type: 'scatter',
      name,
      mode: 'markers',
      marker: {
        size: 12,
        symbol,
        color,
      },
    };
  
    if (hoverFn) {
      return {
        ...baseObj,
        text: filteredData.map((item) => hoverFn(item)),
        hoverinfo: 'text',
      };
    } else if (hovertemplate && hovertextfield) {
      return {
        ...baseObj,
        hovertemplate,
        text: filteredData.map((item) => item[hovertextfield]),
        hoverinfo: 'text',
      };
    }
  
    return baseObj;
  }
  
  interface PlotlyScatterPlotProps {
    data: any[];
    tracesFields: string[];
    xaxisField: string;
    yaxisField: string;
    xylegend: string;
    hoverFn?: (item: any) => string;
    hovertemplate?: string;
    hovertextfield?: string;
    colors?: string[];
    colorsShapesMap?: {
      shapes: { [key: string]: string };
      colors: { [key: string]: string };
    };
    title: string;
    width: number;
    height: number;
    defaultlegend: string;
    backgroundColor: string;
    annotations: any[];
  }
  
  export function getPlotlyScatterPlotObject({
    data,
    tracesFields,
    xaxisField,
    yaxisField,
    xylegend,
    hoverFn,
    hovertemplate,
    hovertextfield,
    colors,
    colorsShapesMap,
    title,
    width,
    height,
    defaultlegend,
    backgroundColor,
    annotations,
  }: PlotlyScatterPlotProps) {
    const colorsToUse = colors || defaultColors;
  
    const markerSymbols = ['circle', 'triangle-up', 'star-square', 'square-x', 'hourglass', 'circle'];
  
    const uniqueTracesArray = tracesFields.map((t, i) =>
      Array.from(new Set(data.map((item) => item[tracesFields[i]])))
    );
  
    function getShape(idx: number, name: string) {
      if (colorsShapesMap && Object.keys(colorsShapesMap.shapes).includes(name)) {
        return colorsShapesMap.shapes[name];
      }
      return markerSymbols[idx];
    }
  
    function getColor(idx: number, name: string) {
      if (colorsShapesMap && Object.keys(colorsShapesMap.colors).includes(name)) {
        return colorsShapesMap.colors[name];
      }
      return colorsToUse[idx];
    }
  
    const plotlyData = uniqueTracesArray.length === 1
      ? uniqueTracesArray[0].map((trace, i) => {
          const xValues = data.filter((item) => item[tracesFields[0]] === trace).map((item, i) =>
            xaxisField ? item[xaxisField] : i
          );
          const yValues = data.filter((item) => item[tracesFields[0]] === trace).map((item, i) =>
            yaxisField ? item[yaxisField] : i
          );
          const filteredData = data.filter((item) => item[tracesFields[0]] === trace);
  
          return getScatterPlotTrace({
            x: xValues,
            y: yValues,
            name: trace,
            color: getColor(i, trace),
            symbol: getShape(0, trace),
            hoverFn,
            hovertemplate,
            hovertextfield,
            filteredData,
          });
        })
      : uniqueTracesArray[0].map((trace, idxouter) =>
        uniqueTracesArray[1].map((innerTrace, idxinner) => {
          const xValues = data.filter(
            (item) => item[tracesFields[0]] === trace && item[tracesFields[1]] === innerTrace
          ).map((item, i) => xaxisField ? item[xaxisField] : i);
          const yValues = data.filter(
            (item) => item[tracesFields[0]] === trace && item[tracesFields[1]] === innerTrace
          ).map((item, i) => yaxisField ? item[yaxisField] : i);
          const filteredData = data.filter(
            (item) => item[tracesFields[0]] === trace && item[tracesFields[1]] === innerTrace
          );
  
          return getScatterPlotTrace({
            x: xValues,
            y: yValues,
            name: trace + '-' + innerTrace,
            color: getColor(idxouter, trace),
            symbol: getShape(idxinner, innerTrace),
            hoverFn,
            hovertemplate,
            hovertextfield,
            filteredData,
          });
        })
      ).flat();
  
    const layout = getLayout({ plotlyData, title, width, height, xylegend, defaultlegend, backgroundColor, annotations });
  
    if (!xaxisField) layout.xaxis = { visible: false };
    if (!yaxisField) layout.yaxis = { visible: false };
    if (hoverFn) {
      layout.hovermode = 'closest';
      layout.hoverlabel = { bgcolor: '#FFF' };
    }

    return {
      data: plotlyData,
      layout
    };
  }
  
  
  
  
  
  