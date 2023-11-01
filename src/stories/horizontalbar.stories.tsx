import type { StoryObj } from "@storybook/react";
import { HorizontalBar } from "../components/Visualizations/HorizontalBar";

const meta = {
  title: "Visualizations/HorizontalBar",
  component: HorizontalBar,
  tags: ["docsPage"]
};

const testData = {
    Value1: {
      B: 23,
      A: 77
    },
    Value2: {
      A: 83,
      B: 17
    },
    'Value 3': {
      A: 91,
      B: 9
    },
    'Value 4': {
      B: 89,
      A: 11
    },
    'Value 5': {
      B: 100
    }
  }
  

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 800,
    height: 400,
    data: testData,
    dimensions: ['B', 'A'],
    labels: ['B', 'A'],
    xylegend: {
      x: 'Test Horizontal Bar. X Axis',
      y: 'Test Horizontal Bar. X Axis'
    }
  
  }
};

export const Stacked: Story = {
    args: {
      width: 800,
      height: 400,
      data: testData,
      dimensions: ['B', 'A'],
      labels: ['B', 'A'],
      xylegend: {
        x: 'Test Horizontal Bar. X Axis',
        y: 'Test Horizontal Bar. X Axis'
      },
      stacked: true
  }
};

export const ShowText: Story = {
    args: {
      width: 800,
      height: 400,
      data: testData,
      dimensions: ['B', 'A'],
      labels: ['B', 'A'],
      xylegend: {
        x: 'Test Horizontal Bar. X Axis',
        y: 'Test Horizontal Bar. X Axis'
      },
      stacked: true,
      showText: true,
      textSuffix: '%',
      textColor: '#666'
  }
};

export const CustomPlotlyCDN: Story = {
    args: {
      width: 800,
      height: 400,
      data: testData,
      dimensions: ['B', 'A'],
      labels: ['B', 'A'],
      xylegend: {
        x: 'Test Horizontal Bar. X Axis',
        y: 'Test Horizontal Bar. X Axis'
      },
      plotlyCdnSource: 'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.58.5/plotly.min.js'    
  }
};
  
