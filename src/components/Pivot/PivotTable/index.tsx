import { useState, useEffect } from 'react';
import getPivotDataColumns from '../utils/pivotMain';

interface PivotTableProps {
  columnsLabels?: string[];
  data: string | any[];
  filters?: any[];
  height?: string;
  maxHeight?: string;
  maxWidth?: string;
  orderBy?: { field: string; order: 'asc' | 'desc' }[];
  postprocessfn?: (data: any) => any;
  rows: any[];
  rowsLimit?: number;
  showColumnTotals?: boolean;
  showRowsTotals?: boolean;
  showSectionTotals?: boolean;
  showRanking?: boolean;
  calculateSectionPercentage?: boolean;
  calculateTotalsPercentage?: boolean;
  tableClassName?: string;
  values?: any[];
  width?: string;
  headerLinks?: (string | ((value: any) => string))[];
}

export  function PivotTable({
  columnsLabels,
  data,
  filters,
  height,
  maxHeight,
  maxWidth,
  orderBy = [],
  headerLinks,
  postprocessfn,
  rows,
  rowsLimit,
  showColumnTotals,
  showSectionTotals,
  showRanking,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  tableClassName,
  values,
  width,
}: PivotTableProps) {
  const [cols, setCols] = useState<any[]>();
  const [pivotRows, setRows] = useState<any[]>();
  const [colsTotals, setColsTotals] = useState<Record<string, any>>();
  const [selectedRow, setSelectedRow] = useState<string | undefined>();

  const getSlicedRows = (rows: any[]) => (rowsLimit ? rows.slice(0, rowsLimit) : rows);

  useEffect(() => {
    const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      orderBy,
      showRanking,
      postprocessfn,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage,
    });
    setColsTotals(colsTotals);
    setCols(colsValues);
    setRows(pivotData);
  }, [data, rows, values, columnsLabels]); // eslint-disable-line

  const getRowClassName = (rowid: string) => (rowid === selectedRow ? 'selected' : null);

  const setSelectedRowFn = (rowid: string) => {
    if (rowid !== selectedRow) {
      setSelectedRow(rowid);
      return;
    }
    setSelectedRow(undefined);
  };

  const getColumnLabel = (col: string, i: number) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;

  const constLength = showRanking ? rows.length + 1 : rows.length;

  const getHeader = () => (
    <thead>
      <tr>
        {cols?.slice(0, constLength).map((col, i) => <th key={`col-${i}`} className="pivotHeader">{getColumnLabel(col, i)}</th>)}
        {cols?.slice(constLength, 100).map((col, i) => (
          <th key={`col-${i + rows.length}`} className="pivotHeaderValue">
            {getColumnLabel(col, i + rows.length)}
          </th>
        ))}
      </tr>
    </thead>
  );

  const getLineClass = (baseClass: string, item: any, y?: number) => {
    if (item.totalsLine) {
      return `${baseClass} pivotSubtotal`;
    } else if (y === 0) {
      return `${baseClass} firstTh`;
    }
    return baseClass;
  };

  function getHeaderValue(value: any, i: number) {
    if (headerLinks && headerLinks[i]) {
      const linkValue =
        typeof headerLinks[i] === 'function'
          ? typeof headerLinks[i] === 'function' 
            ? (headerLinks[i] as (value: any) => string)(value) 
            : undefined
          : `${headerLinks[i]}${value}`;
      return linkValue ? <a href={`${linkValue}`}>{value}</a> : value;
    }
    return value;
  }

  const getRowLine = (row: any[], i: number) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return (
          <th
            key={`th-${i}-${y}`}
            rowSpan={item.rowSpan}
            className={getLineClass('pivotRowHeader', item, y)}
          >
            {getHeaderValue(item.value, y)}
          </th>
        );
      } else if (item.type === 'value') {
        return (
          <td key={`td-${i}-${y}`} className={getLineClass('pivotValue', item)}>
            {item.value}
          </td>
        );
      }
      return null;
    });
    return rowItems.filter((x) => x);
  };

  const getColumnTotalsRow = () => (
    <tr>
      <th
        key="th-totals-col"
        colSpan={rows.length}
        className="pivotRowHeaderTotal"
      >
        Totals:
      </th>
      {colsTotals &&
        Object.keys(colsTotals).map((item, i) => (
          <td key={`td-totals-td-${i}`} className="pivotRowValueTotal">
            {colsTotals[item]}
          </td>
        ))}
    </tr>
  );

  const getRows = () => (
    <tbody>
      {getSlicedRows(pivotRows || []).map((row, i) => (
        <tr
          key={`row-${i}`}
          className={getRowClassName(`row-${i}`)}
          onClick={() => setSelectedRowFn(`row-${i}`)}
        >
          {getRowLine(row, i)}
        </tr>
      ))}
      {showColumnTotals && getColumnTotalsRow()}
    </tbody>
  );

  return (
    <div>
      <table
        className={tableClassName || 'simple-pivot-table'}
        style={{ width, height, maxWidth, maxHeight }}
      >
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  );
}
