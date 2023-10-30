import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { plotlyChoroplethMapHelper, ChoroplethMapOptions } from './helper';
import PropTypes from 'prop-types';

interface PlotlyChoroplethMapProps extends ChoroplethMapOptions {
    relayOutHandler?: any; // Adjust the type accordingly
    plotlyCdnSource?: string;
  }
  
  export function ChoroplethMap({
    data,
    geoField,
    dimensionField,
    labelField,
    mapTitle,
    barTitle,
    dragmode,
    tickprefix,
    colorscale,
    autocolorscale,
    reversescale,
    margin,
    width,
    height,
    projection,
    center,
    hideScale,
    relayOutHandler,
    plotlyCdnSource,
  }: PlotlyChoroplethMapProps) {
    const getChart = () => (
      <PlotlyWrapper
        jsonData={{
          ...plotlyChoroplethMapHelper({
            data,
            geoField,
            dimensionField,
            labelField,
            mapTitle,
            barTitle,
            tickprefix,
            colorscale,
            autocolorscale,
            reversescale,
            dragmode,
            margin,
            width,
            height,
            projection,
            center,
            hideScale,
          }),
        }}
        relayOutHandler={relayOutHandler}
        plotlyCdnSource={plotlyCdnSource}
      />
    );
  
    return <div>{data && getChart()}</div>;
  }
  
  ChoroplethMap.propTypes = {
    data: PropTypes.array,
    geoField: PropTypes.string,
    dimensionField: PropTypes.string,
    labelField: PropTypes.string,
    mapTitle: PropTypes.string,
    barTitle: PropTypes.string,
    tickprefix: PropTypes.string,
    colorscale: PropTypes.array,
    autocolorscale: PropTypes.bool,
    reversescale: PropTypes.bool,
    margin: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    projection: PropTypes.string,
    hideScale: PropTypes.bool,
    plotlyCdnSource: PropTypes.string,
  };