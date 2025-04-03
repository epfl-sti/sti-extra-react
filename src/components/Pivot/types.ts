
type AggregatorFunction = (a: number, b: number) => number;

export type FormatterFunction = (value: number) => number;

export type Aggregator = 'sum' | 'avg' | 'median' | AggregatorFunction | undefined;

export type ValueDescriptor = {
  field: string;
  aggregator: Aggregator;
  formatter?: FormatterFunction;
};

export interface Column {
  field: string;
  label?: string;
  allowedValues: string[];
}

export interface Value {
  field: string;
  label?: string;
  aggregator?: Aggregator;
  formatter?: (x: number) => any;
}

export interface RowItem {
  type: 'header' | 'value';
  value: string;
  rowSpan?: number;
  visible?: boolean;
  totalsLine?: boolean;
}


export interface HeaderItem {
    type: string;
    value: string | number;
    rowSpan: number;
    visible?: boolean;
    totalsLine?: boolean;
  }