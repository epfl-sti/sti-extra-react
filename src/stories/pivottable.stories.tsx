import type { StoryObj } from '@storybook/react'
import { PivotTable } from '../components/Pivot/PivotTable/'
import './index.css'

import testData from '../components/Pivot/testData/index.json'
const meta = {
  title: 'Pivot/PivotTable',
  component: PivotTable,
  tags: ['docsPage'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    showColumnTotals: true,
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const DefaultWithLinks: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    headerLinks: [
      (val) => `https://en.wikipedia.org/wiki/${val}`,
      'https://en.wikipedia.org/wiki/',
    ],
    showColumnTotals: true,
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const RowLimit: Story = {
  args: {
    data: testData,
    rows: ['country'],
    showColumnTotals: false,
    rowsLimit: 10,
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const RowsLimitWithRanking: Story = {
  args: {
    data: testData,
    rows: ['country'],
    rowsLimit: 10,
    showRanking: true,
    columnsLabels: ['#', 'Country', 'Population'],
    orderBy: [
      { field: 'population', order: 'desc' },
    ],
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const OrderBy: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    showColumnTotals: true,
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
    orderBy: [
      { field: 'continent', order: 'desc' },
      { field: 'population', order: 'asc' },
    ],
  },
}

export const ShowSectionTotals: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    showColumnTotals: true,
    showSectionTotals: true,
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const CalculatePercentages: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    showColumnTotals: true,
    showSectionTotals: true,
    calculateTotalsPercentage: true,
    calculateSectionPercentage: true,
    columnsLabels: ['Continent', 'Country', 'Population Sum', 'Section %', 'Totals %'],
    values: [
      { field: 'population', aggregator: 'sum' },
    ],
  },
}

export const ColumnLabelsAndFormatters: Story = {
  args: {
    data: testData,
    rows: ['continent', 'currency_code', 'government', 'country'],
    columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'Population Sum', 'Count'],
    showSectionTotals: true,
    values: [
      {
        field: 'population',
        aggregator: 'sum',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
      { field: 'area' },
    ],
  },
}

export const ColumnLabelsFormattersAndOrderBy: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    columnsLabels: ['Continent', 'Country', 'Population Sum', 'Count'],
    showSectionTotals: true,
    values: [
      {
        field: 'population',
        aggregator: 'sum',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
      { field: 'area' },
    ],
    orderBy: [
      { field: 'continent', order: 'desc' },
      { field: 'population', order: 'desc' },
    ],
  },
}

export const SumAggregatorCastingStr: Story = {
  args: {
    data: testData.map((x) => ({ ...x, population: String(x.population) })),
    rows: ['continent'],
    columnsLabels: ['Continent', 'Population Avg'],
    values: [
      {
        field: 'population',
        aggregator: 'sum',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
    ],
  },
}

export const AverageAggregator: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Population Avg'],
    values: [
      {
        field: 'population',
        aggregator: 'avg',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
    ],
  },
}

export const MedianAggregator: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Population Avg'],
    values: [
      {
        field: 'population',
        aggregator: 'median',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
    ],
  },
}

export const CountAggregator: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Country Count'],
    showColumnTotals: true,
    values: [
      {
        field: 'country',
      },
    ],
  },
}

export const CustomFormatters: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    columnsLabels: ['Continent', 'country', 'Population Sum', 'Area Sum'],
    showColumnTotals: true,
    values: [
      {
        field: 'population',
        aggregator: 'sum',
        formatter: (x: number) => `${parseFloat(String(x / 1000000)).toFixed(2)} M. hab.`,
      },
      {
        field: 'area',
        aggregator: 'sum',
        formatter: (x: number) => `${Math.round(x).toLocaleString()} km²`,
      },
    ],
  },
}

export const PostProcessFunction: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Country Count', 'Custom Field'],
    showColumnTotals: true,
    postprocessfn: (result) => ({
      country: result.country,
      custom_field: 10,
    }),
    values: [
      {
        field: 'country',
      },
    ],
  },
}
