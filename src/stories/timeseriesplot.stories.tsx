import type { StoryObj } from "@storybook/react";
import { TimeSeriesPlot } from "../components/Visualizations/TimeSeries";

const meta = {
  title: "Visualizations/TimeSeriesPlot",
  component: TimeSeriesPlot,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const testData = `Date,A,B
2016/01/01,10,20
2016/07/01,20,10
2016/12/31,40,30
`;

export const Simple: Story = {
  args: {
    data: testData,
    options: {},
  },
};
