import { getLayout } from '../../utils/getPlotlyLayout';

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)',
];

interface PlotlyLineChartObjectProps {
  data: object[];
  dimensions: string[];
  xaxisField: string;
  xylegend: object;
  hoverFn?: (item: any) => string;
  hovertemplate?: string;
  hovertextfield?: string;
  colors?: string[];
  title?: string;
  width?: number;
  height?: number;
  defaultlegend?: boolean;
  hideLegend?: boolean;
  backgroundColor?: string;
  annotations?: object[];
  dateAnnotations?: object[];
}

interface DateAnnotation {
  date: string | number; // The date value where annotation should be placed
  dimension?: string;    // The dimension line to attach to (optional)
  y?: number;            // Custom y value (optional)
  text: string;          // Annotation text
  arrowhead?: number;    // Arrow style
  ax?: number;           // X offset
  ay?: number;           // Y offset
  bgcolor?: string;      // Background color
  bordercolor?: string;  // Border color
  font?: object;         // Font styling
}


export function getPlotlyLineCharttObject({
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
  dateAnnotations = []
}: PlotlyLineChartObjectProps): { data: any[]; layout: any } {
  const colorsToUse: string[] = colors || defaultColors;

  const getLineTrace = (dimension: string, i: number): any => {
    const baseTrace: any = {
      x: data.map((x: any) => x[xaxisField]),
      y: data.map((y: any) => y[dimension]),
      name: dimension,
      marker: {
        color: colorsToUse[i],
        width: 1,
      },
      showlegend: !hideLegend,
      type: 'scatter',
    };
    if (hoverFn) {
      return {
        ...baseTrace,
        text: data.map((item: any) => hoverFn(item)),
        hoverinfo: 'text',
      };
    } else if (hovertemplate && hovertextfield) {
      return {
        ...baseTrace,
        hovertemplate,
        text: data.map((item: any) => item[hovertextfield]),
        hoverinfo: 'text',
      };
    }
    return baseTrace;
  };

  const plotlyData: any[] = dimensions.map((dimension: string, i: number) =>
    getLineTrace(dimension, i)
  );

  const layout: any = getLayout({
    plotlyData,
    title,
    width,
    height,
    xylegend,
    defaultlegend,
    hideLegend,
    backgroundColor,
    annotations,
  });

  if (hoverFn) {
    layout.hovermode = 'closest';
    layout.hoverlabel = { bgcolor: '#FFF' };
  }

    // Process date annotations
    if (dateAnnotations && dateAnnotations.length > 0) {
      if (!layout.annotations) {
        layout.annotations = [];
      }
      
      dateAnnotations.forEach(annotation => {
        const xValue = annotation.date;
        let yValue;
        
        // Find corresponding y value if dimension is specified
        if (annotation.dimension) {
          const dimensionIndex = dimensions.indexOf(annotation.dimension);
          if (dimensionIndex !== -1) {
            // Find the data point closest to the specified date
            const dataPoint = data.find(point => point[xaxisField] === xValue);
            if (dataPoint) {
              yValue = dataPoint[annotation.dimension];
            }
          }
        }
        
        // Use provided y value or calculated one
        yValue = annotation.y !== undefined ? annotation.y : yValue;
        
        // Create the annotation object
        const newAnnotation = {
          x: xValue,
          y: yValue,
          text: annotation.text,
          showarrow: true,
          arrowhead: annotation.arrowhead || 2,
          ax: annotation.ax || 0,
          ay: annotation.ay || -40,
          bgcolor: annotation.bgcolor || 'white',
          bordercolor: annotation.bordercolor || '#c7c7c7',
          font: annotation.font || { size: 12 }
        };
        
        layout.annotations.push(newAnnotation);
      });
    }

  return {
    data: plotlyData,
    layout,
  };
}
