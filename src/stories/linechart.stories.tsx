import type { StoryObj } from "@storybook/react";
import { LineChartPlot } from "../components/Visualizations/LineChart";

const meta = {
  title: "Visualizations/LineChart",
  component: LineChartPlot,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const testData = [
  {
    date: "2021-01-01",
    value: 1,
    value2: 2,
  },
  {
    date: "2021-01-02",
    value: 3,
    value2: 4,
  },
  {
    date: "2021-01-03",
    value: 7,
    value2: 8,
  },
  {
    date: "2021-01-04",
    value: 6,
    value2: 5,
  },
  {
    date: "2021-01-05",
    value: 5,
    value2: 6,
  },
];

export const Simple: Story = {
  args: {
    data: testData,
    title: "Simple Time Series",
    dimensions: ["value"],
    hoverFn: (item: any) => `Date:${item.date}: Value: ${item.value}`,
    xylegend: { x: "Date", y: "Test value" },
    width: 800,
    height: 500,
    defaultlegend: true,
    xaxisField: "date",
  },
};

export const HideLegend: Story = {
  args: {
    data: testData,
    title: "Simple Time Series",
    dimensions: ["value"],
    hoverFn: (item: any) => `Date:${item.date}: Value: ${item.value}`,
    xylegend: { x: "Date", y: "Test value" },
    hideLegend: true,
    width: 800,
    height: 500,
    defaultlegend: true,
    xaxisField: "date",
  },
};

export const TwoDimensions: Story = {
  args: {
    data: testData,
    title: "Simple Time Series",
    dimensions: ["value", "value2"],
    hoverFn: (item: any) => `Date:${item.date}: Value: ${item.value}`,
    xylegend: { x: "Date", y: "Test value" },
    width: 800,
    height: 500,
    defaultlegend: true,
    xaxisField: "date",
  },
};

export const Annotation: Story = {
  args: {
    data: testData,
    title: "Simple Time Series",
    dimensions: ["value", "value2"],
    hoverFn: (item: any) => `Date:${item.date}: Value: ${item.value}`,
    xylegend: { x: "Date", y: "Test value" },
    dateAnnotations: [
      {
        date: '2021-01-02', 
        dimension: 'value',
        text: 'Product Launch',
        ay: -30,
        bgcolor: 'rgba(255,255,255,0.9)'
      },
      {
        date: '2021-01-01',
        x: 10, 
        y: 0,
        text: 'Q3 Start',
        arrowhead: 4
      }
    ],
    width: 800,
    height: 500,
    defaultlegend: true,
    xaxisField: "date",
  },
};