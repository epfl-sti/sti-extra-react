import type { StoryObj } from '@storybook/react'
import { PivotTableBarChart } from '../components/Pivot/PivotTableBarChart/'

import testData from '../components/Pivot/testData/index.json'

const meta = {
  title: 'Pivot/PivotTableBarChart',
  component: PivotTableBarChart,
}

export default meta
type Story = StoryObj<typeof meta>

const fnRound = (number: number, dec = 2) => Math.round(number * Math.pow(10, dec)) / Math.pow(10, dec)

export const Default: Story = {
  args: {
    data: testData,
    rows: ['continent', 'country'],
    showPopOver: true,
    popOverFormatter: (x: number) => `${Math.round(x).toLocaleString()} hab`,
    barLegendSteps: 5,
    values: [{ field: 'population', aggregator: 'sum' }],
  },
}

export const RowsLimit: Story = {
  args: {
    data: testData,
    rows: ['country'],
    barLegendSteps: 5,
    rowsLimit: 10,
    orderBy: [{ field: 'population', order: 'desc' }],
    values: [{ field: 'population', aggregator: 'sum' }],
  },
}

export const RowsLimitWithRanking: Story = {
  args: {
    data: testData,
    rows: ['country'],
    barLegendSteps: 5,
    rowsLimit: 10,
    showRanking: true,
    columnsLabels: ['#', 'Country', 'Population'],
    orderBy: [{ field: 'population', order: 'desc' }],
    values: [{ field: 'population', aggregator: 'sum' }],
  },
}

export const BarsLabels: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Population %', 'Population2 %'],
    barLegendSteps: 10,
    barsMaxValue: 100,
    showBarValues: true,
    barValuesSuffix: '%',
    hideBarLegend: true,
    postprocessfn: (result: any) => {
      const populationTotal = testData.map(x => x.population).filter(x => x).reduce((sum, item) => sum + item, 0)
      return {
        population: fnRound((result.population / populationTotal) * 100, 1),
        population_2: fnRound((result.population / populationTotal) * 80, 1),
      }
    },
    values: [{ field: 'population', aggregator: 'sum' }],
  },
}

export const BarsLabelsCustomHeight: Story = {
  args: {
    data: testData,
    rows: ['continent'],
    columnsLabels: ['Continent', 'Population %', 'Population2 %'],
    barLegendSteps: 10,
    barsMaxValue: 100,
    barsHeight: 30,
    showBarValues: true,
    barValuesSuffix: '%',
    hideBarLegend: true,
    postprocessfn: (result: any) => {
      const populationTotal = testData.map(x => x.population).filter(x => x).reduce((sum, item) => sum + item, 0)
      return {
        population: fnRound((result.population / populationTotal) * 100, 1),
        population_2: fnRound((result.population / populationTotal) * 80, 1),
      }
    },
    values: [{ field: 'population', aggregator: 'sum' }],
  },
}

export const TwoDimensions: Story = {
  args: {
    data: testData,
    rows: ['continent', 'currency_code', 'government', 'country'],
    columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'Population Sum', 'Count'],
    barLegendSteps: 10,
    barsMaxValue: 100,
    postprocessfn: (result: any) => ({
      population: 100,
      area: Math.round((result.population * 100) / (result.area || 1) / 1000),
    }),
    values: [
      { field: 'population', aggregator: 'sum' },
      { field: 'area', aggregator: 'sum' },
    ],
  },
}

export const StackChart: Story = {
  args: {
    data: testData,
    rows: ['continent', 'currency_code', 'government', 'country'],
    columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'bar1', 'bar2', 'bar3', 'bar4'],
    colors: ['#4e79a7', '#e05759', '#59a14f', '#f28e2c'],
    barLegendSteps: 10,
    barsMaxValue: 100,
    barType: 'stack',
    postprocessfn: (result: any) => ({
      bar1: Math.floor(Math.random() * 25),
      bar2: Math.floor(Math.random() * 25),
      bar3: Math.floor(Math.random() * 25),
      bar4: Math.floor(Math.random() * 25),
    }),
    values: [{ field: 'population' }],
  },
}

export const MultiStackChart: Story = {
  args: {
    data: testData,
    rows: ['continent', 'currency_code', 'government', 'country'],
    columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'bar1', 'bar2', 'bar3', 'bar4'],
    colors: ['#4e79a7', '#e05759', '#59a14f', '#f28e2c'],
    barLegendSteps: 10,
    barsMaxValue: 100,
    barType: 'multistack',
    showPopOver: true,
    postprocessfn: (result: any) => ({
      bar1: Math.floor(Math.random() * 25),
      bar2: Math.floor(Math.random() * 25),
      bar3: Math.floor(Math.random() * 25),
      bar4: Math.floor(Math.random() * 25),
    }),
    popOverFunction: (thisRow: any) => {
      const thisRowValues = thisRow.filter((x: any) => x.type === 'value')
      const headerItems = ['Continent', 'Currency', 'Government', 'Country'].map((key, i) => ({
        key,
        value: thisRow[i].value,
      }))
      const valueItems = ['Bar1', 'Bar2', 'Bar3', 'Bar4'].map((key, i) => ({
        key,
        value: thisRowValues[i].value,
      }))
      return [...headerItems, ...valueItems]
    },
    values: [{ field: 'population' }],
  },
}
