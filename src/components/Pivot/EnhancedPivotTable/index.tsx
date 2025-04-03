import React, { useState, useEffect } from 'react';
import getPivotDataColumns from '../utils/pivotMain';
import getGroupedData from '../utils/getGrouped';
import {  Column, Value, RowItem } from '../types';


interface EnhancedPivotTableProps {
  columnsLabels?: string[];
  columns: Column[];
  data: string | any[];
  filters?: any[];
  height?: number | string;
  maxHeight?: string;
  maxWidth?: string;
  orderBy?: any[];
  postprocessfn?: (reduced: any, items: any) => any;
  rows: any[];
  showColumnTotals?: boolean;
  showRowsTotals?: boolean;
  showSectionTotals?: boolean;
  calculateSectionPercentage?: boolean;
  calculateTotalsPercentage?: boolean;
  tableClassName?: string;
  values: Value[];
  width?: number | string;
}

export const EnhancedPivotTable: React.FC<EnhancedPivotTableProps> = ({
  columnsLabels,
  columns,
  data,
  filters,
  height,
  maxHeight,
  maxWidth,
  orderBy,
  postprocessfn,
  rows,
  showColumnTotals,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  tableClassName,
  values,
  width
}) => {
  const [cols, setCols] = useState<string[]>();
  const [pivotRows, setRows] = useState<RowItem[][]>();
  const [colsTotals, setColsTotals] = useState<Record<string, any>>();
  const [selectedRow, setSelectedRow] = useState<string | undefined>();

  // @ts-ignore. The argument 'reduced' is never used but required by the interface.
  function postprocessfnLocal(reduced: any, items: any): Record<string, any> {
    const { grouped } = getGroupedData({
      data: items,
      rowAttributes: columns.map(x => x.field),
      vals: values
    });

    return values.map(x => x.field).reduce((obj, item) => {
      const combinedKeyPrefix = `${item}___`;
      columns[0].allowedValues.forEach(value => {
        obj[`${combinedKeyPrefix}___${value}`] = ((grouped as Record<string, any>)[value] || { [value]: { [item]: '' } })[item];
      });
      return obj;
    }, {} as Record<string, any>);
  }

  const postprocessfnToUse = postprocessfn || postprocessfnLocal;

  useEffect(() => {
    const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      orderBy,
      // @ts-ignore. Disabling the type check for the unused argument.
      postprocessfn: postprocessfnToUse,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage
    });
    setColsTotals(colsTotals);
    setCols(colsValues);
    setRows(pivotData);
  }, [data, rows, values, columnsLabels]);

  const getRowClassName = (rowid: string) => (rowid === selectedRow ? 'selected' : null);

  const setSelectedRowFn = (rowid: string) => {
    setSelectedRow(prev => (prev !== rowid ? rowid : undefined));
  };

  const getColumnLabel = (col: string, i: number) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;

  const getRootColumnLength = () => columns[0].allowedValues.length * values.length;

  const getHeader = () => (
    <thead>
      {columns && (
        <>
          <tr>
            <th colSpan={rows.length}>{' '}</th>
            <th colSpan={getRootColumnLength()} style={{ textAlign: 'center' }}>
              {columns[0].label || columns[0].field}
            </th>
          </tr>
          <tr>
            <th colSpan={rows.length}>{' '}</th>
            {values.map((x, i) => (
              <th key={i} style={{ textAlign: 'center' }} colSpan={columns[0].allowedValues.length}>
                {x.label || x.field}
              </th>
            ))}
          </tr>
        </>
      )}
      <tr>
        {cols?.slice(0, rows.length).map((col, i) => (
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>
        ))}
        {columns &&
          values.flatMap(() => columns[0].allowedValues).map((x, i) => (
            <th key={i} className='pivotHeaderValue pivotHeaderInternal' style={{ textAlign: 'center' }}>
              {x}
            </th>
          ))}
      </tr>
    </thead>
  );

  const getRowLine = (row: RowItem[], i: number) =>
    row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return (
          <th key={`th-${i}-${y}`} rowSpan={item.rowSpan} className='pivotRowHeader'>
            {item.value}
          </th>
        );
      } else if (item.type === 'value') {
        return <td key={`td-${i}-${y}`} className='pivotValue'>{item.value}</td>;
      }
    });

  const getRows = () => (
    <tbody>
      {pivotRows?.map((row, i) => (
        <tr key={`row-${i}`} className={getRowClassName(`row-${i}`) || ''} onClick={() => setSelectedRowFn(`row-${i}`)}>
          {getRowLine(row, i)}
        </tr>
      ))}
      {showColumnTotals && (
        <tr>
          <th colSpan={rows.length} className='pivotRowHeaderTotal'>Totals:</th>
          {Object.keys(colsTotals || {}).map((item, i) => (
            <td key={`td-totals-td-${i}`} className='pivotRowValueTotal'>{colsTotals?.[item]}</td>
          ))}
        </tr>
      )}
    </tbody>
  );

  return (
    <div>
      <table className={tableClassName || 'simple-pivot-table'} style={{ width, height, maxWidth, maxHeight }}>
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  );
};
