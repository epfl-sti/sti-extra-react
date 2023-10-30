export const getLegend = (defaultlegend: boolean) =>
  defaultlegend
    ? null
    : {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1,
        xanchor: 'right',
        x: 1,
      };

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function getNoMatchingDataLayout() {
  return {
    xaxis: {
      visible: false,
    },
    yaxis: {
      visible: false,
    },
    annotations: [
      {
        text: 'No matching data. Please check your filters and try again.',
        xref: 'paper',
        yref: 'paper',
        showarrow: false,
        font: {
          size: 20,
        },
      },
    ],
  };
}

export function getLayout({
  plotlyData,
  title,
  width,
  height,
  dragmode,
  xylegend,
  hoverlabel,
  boxmode,
  barmode,
  stacked,
  defaultlegend,
  hideLegend,
  backgroundColor,
  annotations,
  ysuffix,
  xrange,
  yrange,
}: any) {
  // The barchart mode can be defined explicitly with the 'barmode' or can be 'stacked' just
  // by passing that property.
  function getBarMode() {
    if (barmode) {
      return barmode;
    } else if (stacked) {
      return 'stack';
    }
  }

  // Adjust the plotly width for mobile devices (mainly small phone devices).
  const viewport = getWindowDimensions();
  const widthSentOrCalculated = viewport.width < 800 ? viewport.width - 10 : width;

  const missingData = plotlyData.filter(
    (trace: any) => trace.x.length === 0 && trace.y.length === 0
  );
  if (missingData.length === plotlyData.length) {
    return getNoMatchingDataLayout();
  }
  return {
    title,
    width: widthSentOrCalculated,
    height,
    yaxis: {
      size: '5px',
      automargin: true,
      ticksuffix: ysuffix || '  ',
      title: { text: xylegend && xylegend.y, standoff: 10 },
      range: yrange,
    },
    xaxis: {
      title: { text: xylegend && xylegend.x },
      range: xrange,
    },
    // Juan the default color of the background can be overwritten using ie:
    // - hoverlabel: { bgcolor: "#eee" },
    hoverlabel,
    // As per dean request, horizontal legend.
    legend: getLegend(defaultlegend),
    showLegend: !hideLegend,
    barmode: getBarMode(),
    boxmode,
    dragmode,
    plot_bgcolor: backgroundColor,
    paper_bgcolor: backgroundColor,
    annotations,
  };
}