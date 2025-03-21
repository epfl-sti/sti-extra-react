const defaultColors: string[] = [
    'rgba(55,128,191,0.6)',
    'rgba(255,153,51,0.6)'
  ];
  
  interface PlotlyPieChartObject {
    data: number[];
    labels: string[];
    colors?: string[];
    title: string;
    width: number;
    height: number;
    textinfo?: string;
    textposition?: string;
    hoverFn?: (args: [string, number]) => string;
  }
  
  export function getPieChartObject({
    data,
    labels,
    colors,
    title,
    width,
    height,
    textinfo,
    textposition,
    hoverFn
  }: PlotlyPieChartObject) {
    const colorsToUse = colors || defaultColors;
    const textInfoToUse = textinfo || 'label+value';
    const textPositionToUse = textposition || 'outside';
  
    const plotlyData = [
      {
        type: 'pie',
        values: data,
        labels,
        textinfo: textInfoToUse,
        textposition: textPositionToUse,
        marker: {
          colors: colorsToUse
        },
        automargin: true
      }
    ];
  
    const dataWithHover = hoverFn
      ? [
          {
            ...plotlyData[0],
            text: data.map((item, i) => hoverFn([labels[i], item])),
            hoverinfo: 'text'
          }
        ]
      : plotlyData;
  
    const layout = {
      height,
      width,
      showlegend: false,
      hoverlabel: { bgcolor: '#fff' },
      title
    };
  
    return {
      data: dataWithHover,
      layout
    };
  }
  