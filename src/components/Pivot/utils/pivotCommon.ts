import soa from 'sort-objects-array';

export function removeNewLines(val: string): string {
  return val.replace(/(\r\n|\n|\r)/gm, '');
}

interface ValueField {
  field: string;
  aggregator?: 'sum' | 'count' | 'avg' | 'min' | 'max';
}

interface GetColumnsParams {
  columnsLabels?: string[];
  rows: string[];
  values: ValueField[];
  calculateTotalsPercentage?: boolean;
  calculateSectionPercentage?: boolean;
  showRanking?: boolean;
}

export function getColumns({
  columnsLabels,
  rows,
  values,
  calculateTotalsPercentage,
  calculateSectionPercentage,
  showRanking
}: GetColumnsParams): string[] {
  if (columnsLabels) {
    return columnsLabels;
  }

  if (values.length === 1 && calculateTotalsPercentage && calculateSectionPercentage) {
    return [...rows, values[0].field, 'totals_section_percentage', 'totals_percentage'];
  }

  if (values.length === 1 && calculateTotalsPercentage) {
    return [...rows, values[0].field, 'totals_percentage'];
  }

  if (values.length === 1 && calculateSectionPercentage) {
    return [...rows, values[0].field, 'totals_section_percentage'];
  }

  if (showRanking) {
    const index = rows.length - 1;
    const rowsWithRanking = [...rows.slice(0, index), 'ranking', ...rows.slice(index)];
    return [...rowsWithRanking, ...values.map(x => x.field)];
  }

  return [...rows, ...values.map(x => x.field)];
}

function filterIterations<T>(rawRows: T[], filters: ((row: T) => boolean)[]): T[] {
  let filteredRows = [...rawRows];
  filters.forEach(filterFn => {
    filteredRows = filteredRows.filter(filterFn);
  });
  return filteredRows;
}

export function timerFn(functionName: string): () => void {
  const t0 = performance.now();
  return () => {
    const t1 = performance.now();
    console.log(`TIMER (${functionName}) took ${(t1 - t0)} milliseconds.`);
  };
}

function getMostCommonSeparator(val: string): string {
  const possibleDelimiters = ['\t', ',', ';', '","'];
  const delimitersCount: Record<string, number> = possibleDelimiters.reduce(
    (obj, key) => { 
      obj[key] = val.split(key).length; 
      return obj; 
    }, 
    {} as Record<string, number>
  );
  
  const sorted = soa(Object.entries(delimitersCount).map(([key, value]) => ({ key, value })), 'value', 'desc');

  // Deal with "," case
  if ((sorted[1] || {}).key === '","' && sorted[0].key === ',') {
    return sorted[1].key;
  }

  return sorted[0].key;
}

function getJsonValue(key: string): string | number {
  const numericValue = parseFloat(key);
  // @ts-ignore. Juan this comparison is intentional
  return numericValue == key ? numericValue : key;
}

export function csvToJson(val: string): Record<string, string | number>[] {
  const separator = getMostCommonSeparator(val);
  const splitcsv = separator === '","'
    ? val.split('\n').filter(x => x).map(x => x.slice(1, -1))
    : val.split('\n').filter(x => x);

  const header = splitcsv[0].split(separator).map(x => removeNewLines(x));
  
  const json = splitcsv.slice(1).map(line =>
    line.split(separator)
      .map(x => removeNewLines(x))
      .reduce((obj, key, i) => { 
        obj[header[i]] = getJsonValue(key); 
        return obj; 
      }, {} as Record<string, string | number>)
  );

  return json;
}

export function getCsvContents(
  pivotRows: { value: string }[][], 
  cols: string[], 
  rows: string[], 
  showColumnTotals?: boolean, 
  colsTotals?: Record<string, string | number>
): string {
  const header = `"${cols.join('","')}"`;
  
  const thisRows = pivotRows
    .map(x => x.map(y => y.value))
    .map(x => `"${x.join('","')}"`)
  
  if (showColumnTotals && colsTotals) {
    const totalLine = new Array(rows.length).fill('totals');
    Object.keys(colsTotals).forEach(item => {
      totalLine.push(colsTotals[item]);
    });
    thisRows.push(`"${totalLine.join('","')}"`);
  }

  return [header, ...thisRows].join('\n');
}

function checkValidJSON(val: any): val is any[] {
  const expectedConstructor = ([]).constructor;
  return val.constructor === expectedConstructor;
}

export function getFilteredRows<T = Record<string, string | number>>(
  rawRows: T[] | string, 
  filters?: ((row: T) => boolean)[]
): T[] {
  const validJson = checkValidJSON(rawRows);
  const loadedData = validJson ? rawRows : csvToJson(rawRows as string) as T[];
  return filters
    ? filterIterations(loadedData, filters)
    : loadedData;
}