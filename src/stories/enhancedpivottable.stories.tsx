import type { StoryObj } from '@storybook/react'
import { EnhancedPivotTable } from '../components/Pivot/EnhancedPivotTable'
import './index.css'

import testData from '../components/Pivot/testData/index.json'

const meta = {
  title: 'Pivot/EnhancedPivotTable',
  component: EnhancedPivotTable,
  tags: ['docsPage'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: testData,
    columns: [{
      field: 'continent',
      label: 'Continent',
      allowedValues: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania']
    }],
    rows: ['government'],
    values: [
      { 
        field: 'population', 
        label: 'Population', 
        aggregator: 'sum',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
      { 
        field: 'area', 
        label: 'Area', 
        aggregator: 'sum',
        formatter: (x: number) => Math.round(x).toLocaleString(),
      },
    ],
  },
}
