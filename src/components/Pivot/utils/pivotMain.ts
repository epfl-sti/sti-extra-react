import {
  getColumns,
  getFilteredRows,
  getCsvContents,
  csvToJson
} from './pivotCommon';
import getGroupedData from './getGrouped';
import getDenormalized from './getDenormalized';
import getFullTree from './getFullTree';

interface ValueField {
  field: string;
}

interface PivotDataColumnsParams {
  data: any[] | string;
  filters?: ((row: any) => boolean)[];
  rows: string[];
  values: ValueField[];
  columnsLabels?: string[];
  postprocessfn?: (data: any) => any;
  getOriginals?: boolean;
  showSectionTotals?: boolean;
  showColumnTotals?: boolean;
  calculateSectionPercentage?: boolean;
  calculateTotalsPercentage?: boolean;
  getTree?: boolean;
  orderBy?: { field: string; order: 'asc' | 'desc' }[];
  showRanking?: boolean;
}

interface GroupedData {
  grouped: Record<string, any>;
  valueTotals?: Record<string, number | string>;
  groupedOriginals?: { [x: string]: any[] } | any[];
}

export default function getPivotDataColumns({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  getOriginals,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  getTree,
  orderBy,
  showRanking
}: PivotDataColumnsParams): any {
  const groupedData: GroupedData = getGroupedData({
    data: getFilteredRows(data, filters),
    rowAttributes: rows,
    vals: values,
    postprocessfn,
    getOriginalsFlag: getOriginals,
    showSectionTotals,
    calculateSectionPercentage,
    calculateTotalsPercentage
  });

  const colsTotals = groupedData.valueTotals;
  const colsValues = getColumns({
    columnsLabels, 
    rows, 
    values, 
    calculateTotalsPercentage, 
    calculateSectionPercentage, 
    showRanking 
  });
  
  const pivotData = getDenormalized(groupedData, rows, orderBy, showRanking);

  if (getOriginals) {
    const { groupedOriginals } = groupedData;
    return { pivotData, colsValues, colsTotals, groupedOriginals };
  }

  if (getTree) {
    const tree = getFullTree(groupedData);
    return tree;
  }

  return { pivotData, colsValues, colsTotals };
}

export function getPivotCsvData({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  showColumnTotals,
  showSectionTotals
}: Omit<PivotDataColumnsParams, 'getTree' | 'getOriginals' | 'calculateTotalsPercentage' | 'calculateSectionPercentage' | 'orderBy' | 'showRanking'> & {
  showColumnTotals?: boolean;
}): string {
  const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn,
    showSectionTotals
  });

  const csvData = getCsvContents(
    pivotData, 
    colsValues, 
    rows, 
    showColumnTotals, 
    colsTotals
  );

  return csvData;
}

export function getPivotJsonData({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  showColumnTotals,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  getTree
}: PivotDataColumnsParams): any {
  if (!getTree) {
    const csvData = getPivotCsvData({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      postprocessfn,
      showColumnTotals,
      showSectionTotals
    });
    
    const jsonData = csvToJson(csvData);
    return jsonData;
  }

  const tree = getPivotDataColumns({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn,
    showColumnTotals,
    showSectionTotals,
    calculateSectionPercentage,
    calculateTotalsPercentage,
    getTree
  });

  return tree;
}