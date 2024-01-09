import PlotlyWrapper from '../../utils/PlotlyWrapper'
import { plotlyChoroplethMapHelper, ChoroplethMapOptions } from './helper';

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
