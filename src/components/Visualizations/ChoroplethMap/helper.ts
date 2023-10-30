import countries from './countries.json';

const contriesIsoKeys: string[] = Object.keys(countries);

const defaultColorScale: [number, string][] = [
  [0, 'rgb(145, 7, 7)'], [0.049, 'rgb(172, 5, 5)'],
  [0.05, 'rgb(172, 5, 5)'], [0.35, 'rgb(190, 40, 40)'],
  [0.5, 'rgb(245, 70, 70)'], [0.6, 'rgb(245, 90, 90)'],
  [0.7, 'rgb(247, 106, 106)'], [0.98, 'rgb(220, 220, 220)'],
  [0.989, 'rgb(220, 220, 220)'], [1, 'rgb(255, 255, 255)']
];

const defaultMargin = {
  l: 0,
  r: 0,
  b: 0,
  t: 25,
  pad: 2
};

export interface ChoroplethMapOptions {
  data: any[]; // Adjust the type accordingly
  geoField: string;
  dimensionField: string;
  labelField?: string;
  mapTitle: string;
  barTitle?: string;
  barThickness?: number;
  dragmode?: boolean;
  tickprefix?: string;
  colorscale?: [number, string][];
  autocolorscale?: boolean;
  reversescale?: boolean;
  margin?: typeof defaultMargin;
  width?: number;
  height?: number;
  projection?: { 
    type?: string
    scale?: number,
    rotation?: any

  };
  center?: any; // Adjust the type accordingly
  hideScale?: boolean;
}

export function plotlyChoroplethMapHelper({
  data,
  geoField,
  dimensionField,
  labelField,
  mapTitle,
  barTitle,
  barThickness = 10,
  dragmode,
  tickprefix = '',
  colorscale = defaultColorScale,
  autocolorscale = false,
  reversescale = false,
  margin = defaultMargin,
  width = 800,
  height = 500,
  projection = { type: 'robinson' },
  center,
  hideScale = false
}: ChoroplethMapOptions): { data: any, layout: any } {
  const extract = (data: any[], key: string) => data.map(item => item[key]);

  const reducedData = data.reduce((obj: any, item: any) => {
    obj[item[geoField]] = { value: item[dimensionField], label: labelField ? item[labelField] : countries[item[geoField]] };
    return obj;
  }, {});

  const dataWithZeros = contriesIsoKeys.map(item => {
    if (reducedData[item]) {
      return {
        ...reducedData[item],
        geoField: item
      };
    }
    return {
      value: 0,
      label: countries[item],
      geoField: item
    };
  });

  const mapData = [{
    type: 'choropleth',
    locations: extract(dataWithZeros, 'geoField'),
    z: extract(dataWithZeros, 'value'),
    text: extract(dataWithZeros, 'label'),
    colorscale,
    autocolorscale,
    reversescale: !reversescale,
    marker: {
      line: {
        color: '#999',
        width: 0.5
      }
    },
    tick0: 0,
    zmin: 0,
    dtick: 1000,
    showscale: !hideScale,
    colorbar: {
      color: '#999',
      autotic: false,
      thickness: barThickness,
      tickprefix,
      title: barTitle
    }
  }];

  const layout = {
    title: mapTitle,
    geo: {
      showframe: false,
      showcoastlines: false,
      projection,
      center
    },
    margin,
    width,
    height,
    dragmode
  };

  return {
    data: mapData,
    layout
  };
}
