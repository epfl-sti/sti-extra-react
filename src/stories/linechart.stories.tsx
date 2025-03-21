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
  },
  {
    date: "2021-01-02",
    value: 3,
  },
  {
    date: "2021-01-03",
    value: 7,
  },
  {
    date: "2021-01-04",
    value: 6,
  },
  {
    date: "2021-01-05",
    value: 5,
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
