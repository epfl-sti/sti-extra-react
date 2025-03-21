import type { StoryObj } from "@storybook/react";
import { ScatterPlot } from "../components/Visualizations/ScatterPlot";
import countries from "./testData.json";

const meta = {
  title: "Visualizations/ScatterPlot",
  component: ScatterPlot,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: countries,
    title: "Countries: Population vs Area",
    tracesFields: ["continent"],
    hoverFn: (item: any) => `${item.iso}: ${item.name}`,
    xylegend: { x: "area", y: "population" },
    width: 800,
    height: 500,
    backgroundColor: "rgb(253, 253, 253)",
    defaultlegend: true,
    yaxisField: "population",
    xaxisField: "area",
  },
};

export const BottomLegend: Story = {
  args: {
    data: countries,
    title: "Countries: Population vs Area with Legend",
    tracesFields: ["continent"],
    hoverFn: (item: any) => `${item.iso}: ${item.name}`,
    xylegend: { x: "area", y: "population" },
    width: 800,
    height: 500,
    backgroundColor: "rgb(253, 253, 253)",
    defaultlegend: true,
    yaxisField: "population",
    xaxisField: "area",
    bottomLegend:
      "<i>This small italics legend should appear at the bottom of the graph</i>. It supports html tags: <b>HTML</b>",
  },
};
