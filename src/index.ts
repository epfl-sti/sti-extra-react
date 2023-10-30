declare global {
    const XLSX: any;
}

export { LineChartPlot } from './components/Visualizations/LineChart'
export { HorizontalBoxplot } from  './components/Visualizations/Boxplot/HorizontalBoxplot'
export { HorizontalBoxplotGrouped } from  './components/Visualizations/Boxplot/HorizontalBoxplotGrouped'
export { HorizontalBar } from './components/Visualizations/HorizontalBar'
export { ChoroplethMap } from './components/Visualizations/ChoroplethMap'
export { PieChart } from './components/Visualizations/Piechart/'
export { ScatterPlot }  from './components/Visualizations/Scatterplot/'
export { TimeSeriesPlot } from './components/Visualizations/TimeSeries'
export { VerticalBar } from './components/Visualizations/VerticalBar'
export { XlsGenerator } from './components/Xls/Generator/'
export { XlsReader } from './components/Xls/Reader/'