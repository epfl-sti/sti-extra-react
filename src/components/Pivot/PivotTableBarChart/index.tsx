import { useState, useEffect } from 'react'

import getPivotDataColumns from '../utils/pivotMain'

import { separator } from '../utils/settings'
import getChunks from '../utils/getChunks'

import GaugeChart from '../BarCharts/GaugeChart'
import StackChart from '../BarCharts/StackChart'

import D3Header from '../BarCharts/D3Header'
import getLinearScale from '../BarCharts/d3getLinearScale'
import getMinMaxValues from '../BarCharts/getMinMaxValue'

import PopOver from '../PopOver/'
import { HeaderItem, RowItem, Value } from '../types'


interface PivotTableBarChartProps {
  barLegendFormatter?: (value: number) => string;
  barLegendSteps?: number;
  barType?: 'gauge' | 'stack' | 'multistack';
  barsHeight?: number;
  barsMaxValue?: number;
  barsMinValue?: number;
  columnsLabels?: string[];
  colors?: string[];
  data: any[];
  filters?: any;
  height?: number | string;
  hideColumns?: number[]
  highlightRows: string[]
  maxHeight?: number | string;
  maxWidth?: number | string;
  multiStackSplit?: number;
  orderBy?: { field: string; order: 'asc' | 'desc' }[];
  popOverFormatter?: (value: number) => string;
  popOverFunction?: (row: any) => { key: string; value: any }[];
  postprocessfn?: (result: any) => { [key: string]: any };
  rows: string[];
  showPopOver?: boolean;
  showRanking?: boolean;
  values: Value[];
  width?: number | string;
  rowsLimit?: number;
  hideBarLegend?: boolean;
  showBarValues?: boolean;
  tableClassName?: string;
  barValuesSuffix?: string;
}

export function PivotTableBarChart ({
  barLegendFormatter,
  barLegendSteps = 10,
  barType = 'gauge',
  barsHeight = 15,
  barsMaxValue,
  barsMinValue = 0,
  columnsLabels,
  colors,
  data,
  filters,
  height,
  hideColumns,
  highlightRows,
  maxHeight,
  maxWidth,
  multiStackSplit = 2,
  orderBy,
  popOverFormatter,
  popOverFunction,
  postprocessfn,
  rows,
  rowsLimit,
  showPopOver,
  showRanking,
  tableClassName,
  values,
  width
}: PivotTableBarChartProps) {
  const [cols, setCols] = useState<string[] | undefined>()
  const [pivotRows, setRows] = useState<RowItem[][] | undefined>()
  const [groupedDataState, setGroupedDataState] = useState<Record<string, any> | undefined>()
  const [maxValue, setMaxValue] = useState<number | undefined>()
  const [minValue, setMinValue] = useState<number | undefined>()

  const getOriginals = true

  const getSlicedRows = (rows: RowItem[][]) => rowsLimit ? rows.slice(0, rowsLimit) : rows

  useEffect(() => {
    // @ts-ignore. colsTotals is disregarded and not used
    const { pivotData, colsValues, colsTotals, groupedOriginals } = getPivotDataColumns({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      orderBy,
      showRanking,
      postprocessfn,
      getOriginals
    })

    setCols(colsValues)
    setRows(pivotData)
    setGroupedDataState(groupedOriginals)
    setMinValue(barsMinValue)
    if (!barsMaxValue) {
      const { calcMaxValue } = getMinMaxValues(pivotData)
      setMaxValue(calcMaxValue)
    } else {
      setMaxValue(barsMaxValue)
    }
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

  const getColumnLabel = (col: string, i: number): string =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getColsLength = () => showRanking 
    ? rows.length + 1
    : rows.length

  const getHeaderClassName = (value: string) => {
      if (!highlightRows) {
        return 'pivotRowHeader'
      }
      if (highlightRows.includes(value)) {
        return 'pivotRowHeader pivotRowHeaderHighlight'
      }
      return 'pivotRowHeader'
    }
  

  const getHeader = () =>
    <thead>
      <tr>
        {cols.slice(0, getColsLength()).map((col: string, i: number) =>
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>)}
        <th key='bar-header' className='bar-header'>
          <D3Header
            height={barsHeight}
            legendValues={getLinearScale(minValue, maxValue, barLegendSteps, barLegendFormatter).map(value => value.toString())}
          />
        </th>
      </tr>
    </thead>

  interface ValueItem {
    type: string;
    value: any;
  }

  interface ValuesObj {
    [key: string]: any;
  }

  interface GetValuesObjResult {
    valuesObj: ValuesObj;
    valuesCols: string[];
  }

  const getValuesObj = (row: ValueItem[]): GetValuesObjResult => {
    const values = row.filter(x => x.type === 'value').map(x => x.value);
    const valuesCols = cols?.slice(rows.length, 100) || [];
    const valuesObj = values.reduce((obj: ValuesObj, val, i) => {
      obj[valuesCols[i]] = val;
      return obj;
    }, {});
    return { valuesObj, valuesCols };
  };
  
  interface DataArrayItem {
    key: string;
    value: string;
  }
  
  function getBarChart (valuesObj: ValuesObj, valuesCols: string[], dataArray: DataArrayItem[]) {

    if (barType === 'gauge') {
      return (
        <PopOver showPopOver={showPopOver} dataArray={dataArray}>
          <GaugeChart
            dataElement={valuesObj}
            dimensions={valuesCols}
            height={barsHeight}
            colors={colors}
            minValue={minValue}
            maxValue={maxValue}
          />
        </PopOver>
      )
    } else if (barType === 'stack') {
      return (
        <PopOver showPopOver={showPopOver} dataArray={dataArray}>
          <StackChart
            dataElement={valuesObj}
            dimensions={valuesCols}
            height={barsHeight}
            colors={colors}
            minValue={minValue}
            maxValue={maxValue}
          />
        </PopOver>
      )
    } else if (barType === 'multistack') {
      const valuesColsChunks = getChunks(valuesCols, multiStackSplit)
      const colorsChunks = getChunks(colors)
      return (
        <PopOver showPopOver={showPopOver} dataArray={dataArray}>
          {valuesColsChunks.map((chunk, index) =>
            <StackChart
              key={`multiStack-${index}`}
              dataElement={valuesObj}
              dimensions={chunk}
              height={barsHeight}
              colors={colorsChunks[index]}
              minValue={minValue}
              maxValue={maxValue}
            />
          )}
        </PopOver>
      )
    }
  }

  

  const getPopOverDataArray = (headerItems: HeaderItem[], row: RowItem[]) => {
    if (!showPopOver) {
      return []
    }
    if (popOverFunction) {
      return popOverFunction(row)
    }
    const headerLen = headerItems.length
    const rowsLen = rows.length
    const rowKey = !showRanking 
      ? headerItems.map(x => x.value).join(separator)
      : [...headerItems.slice(0, headerLen - 2), ...headerItems.slice(headerLen -1)].map(
          x => x.value).join(separator)
    // Popover Keys
    const popOverKeys = !showRanking
        ? rows
        : [...rows.slice(0, rowsLen - 1), 'ranking', ...rows.slice(rowsLen - 1)]

    const originalValue = groupedDataState[rowKey]
    const dataArray: DataArrayItem[] = []
    headerItems.forEach((item, i) => {
      dataArray.push({ key: popOverKeys[i], value: String(item.value) })
    })
    Object.keys(originalValue).forEach(key => {
      const item = originalValue[key]
      dataArray.push({ key, value: popOverFormatter ? popOverFormatter(item) : item })
    })
    return dataArray
  }

  const getItemValue = (i: number, value: any) => {
    if (hideColumns && hideColumns.includes(i + 1)) {
      return ''
    }
    return value
  }

  const getRowLine = (row: RowItem[], i: number) => {
    const headerItems = row.filter((x) => x.type === 'header');
    const popOverDataArray = getPopOverDataArray(headerItems as HeaderItem[], row);
    const rowItems = headerItems
      .map((item, y) =>
        item.visible ? (
          <th
            key={`th-${i}-${y}`}
            rowSpan={item.rowSpan}
            className={getHeaderClassName(item.value)}
          >
            {getItemValue(y, item.value)}
          </th>
        ) : null
      )
      .filter((x) => x);
    const { valuesObj, valuesCols } = getValuesObj(row);
    rowItems.push(
      <td key={`bar-${i}`} className="bar">
        {getBarChart(valuesObj, valuesCols, popOverDataArray)}
      </td>
    );
    return rowItems.filter((x) => x);
  };

  const getRows = () =>
    <tbody>
      {getSlicedRows(pivotRows || []).map((row, i) => (
        <tr key={`row-${i}`}>
          {getRowLine(row, i)}
        </tr>
      ))}
    </tbody>

  return (
    <div>
      <table  className={tableClassName || 'simple-pivot-table'} style={{ width, height, maxWidth, maxHeight }}>
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  )
}
