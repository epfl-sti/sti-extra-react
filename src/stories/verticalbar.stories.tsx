import type { StoryObj } from "@storybook/react";
import { VerticalBar } from "../components/Visualizations/VerticalBar";
import testData from "./verticalbarTestData.json";

const meta = {
  title: "Visualizations/VerticalBar",
  component: VerticalBar,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: testData.data,
    dimensions: ["label1Perc", "label2Perc", "availPerc"],
    labels: ["Label1", "Label2", "Label3"],
    xylegend: { x: "fakeentity", y: "% of label1 (fake entity)" },
    colors: testData.label3StatusColors,
    width: 950,
    height: 700,
    showlegend: false,
    ysuffix: "% ",
    title: "Mock Status per Fake Entity (2021)",
  },
};

export const Stacked: Story = {
  args: {
    data: testData.data,
    dimensions: ["label1Perc", "label2Perc", "availPerc"],
    labels: ["Label1", "Label2", "Label3"],
    xylegend: { x: "fakeentity", y: "% of label1 (fake entity)" },
    colors: testData.label3StatusColors,
    width: 950,
    height: 700,
    showlegend: false,
    stacked: true,
    ysuffix: "% ",
    title: "Mock Status per Fake Entity (2021)",
  },
};

export const StackedWithAnnotations: Story = {
  args: {
    data: testData.data,
    dimensions: ["label1Perc", "label2Perc", "availPerc"],
    labels: ["Label1", "Label2", "Label3"],
    xylegend: { x: "fakeentity", y: "% of label1 (fake entity)" },
    colors: testData.label3StatusColors,
    hoverFn: (item) =>
      [
        `<b>Fake Entity</b> ${item.fakeentity}`,
        `<b>Label1</b>: ${item.label3.toLocaleString()}`,
        `<b>Label2</b>: ${item.label1.toLocaleString()}`,
        `<b>Label3</b>: ${item.label2.toLocaleString()}`,
        `<b>% of Label1</b>: ${parseInt(item.label1Perc)}%`,
      ].join("<br />"),
    width: 950,
    height: 700,
    annotations: testData.annotations,
    showlegend: false,
    todayLine: true,
    stacked: true,
    ysuffix: "% ",
    averageLine: "label1Perc",
    title: "Mock Status per Fake Entity (2021)",
  },
};
