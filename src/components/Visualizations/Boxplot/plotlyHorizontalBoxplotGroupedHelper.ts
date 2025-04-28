import { getLayout } from '../../utils/getPlotlyLayout'

const defaultColors: string[] = [
  'rgba(55,128,191,0.6)',
  'rgba(255,153,51,0.6)'
];

export function getPlotlyHboxPlotGrouppedObject<T>({
  data,
  dataKeys,
  dataInnerKeys,
  dimensions,
  xylegend,
  colors,
  colorsShapesMap,
  title,
  width,
  height
}: {
  data: T;
  dataKeys?: string[];
  dataInnerKeys?: string[];
  dimensions: string[];
  xylegend: any;
  colors?: string[];
  colorsShapesMap?: any;
  labels?: any;
  stacked?: any;
  title?: string;
  width?: number;
  height?: number;
}): { data: any[]; layout: any } {

  const colorsToUse: string[] = colors || defaultColors;

  const getDimensionValue = (outerlevel: keyof T, innerlevel: keyof T[keyof T]) =>
    data[outerlevel][innerlevel]
      ? data[outerlevel][innerlevel][dimensions[0]]
      : [0];

  function getColor(idx: number, name: string): string {
    if (
      colorsShapesMap &&
      Object.keys(colorsShapesMap.colors).includes(name)
    ) {
      return colorsShapesMap.colors[name];
    }
    return colorsToUse[idx];
  }

  const originalKeys = Object.keys(data);
  const keys = dataKeys ? dataKeys.reverse().filter((x) => originalKeys.includes(String(x))) : originalKeys;

  const plotlyData: any[] = keys.map((outerlevel, i) => {
    const innerKeys = dataInnerKeys ? dataInnerKeys.reverse() : Object.keys(data[keys[0]]);
    const y = innerKeys.filter(key => data[outerlevel][key])
      .map(innerlevel =>
        Array(getDimensionValue(outerlevel, innerlevel).length).fill(innerlevel)
      )
      .flat();

    const x = innerKeys.filter(key => data[outerlevel][key])
      .map(innerlevel => getDimensionValue(outerlevel, innerlevel))
      .flat();

    return {
      x,
      y,
      name: outerlevel,
      marker: { color: getColor(i, outerlevel) },
      type: 'box',
      boxpoints: false,
      boxmean: true,
      orientation: 'h'
    };
  });

  const layout = getLayout({
    plotlyData,
    title,
    width,
    height,
    xylegend,
    boxmode: 'group'
  });
  layout.hovermode = 'closest';

  return {
    data: plotlyData,
    layout
  };
}
