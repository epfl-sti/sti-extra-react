import type { StoryObj } from "@storybook/react";
import { PieChart } from "../components/Visualizations/PieChart";
import countries from "./testData.json";

const meta = {
  title: "Visualizations/PieChart",
  component: PieChart,
  tags: ["docsPage"],
};

const ch = countries.filter((x) => x.iso === "CH")[0];
const fr = countries.filter((x) => x.iso === "FR")[0];
const de = countries.filter((x) => x.iso === "DE")[0];
const it = countries.filter((x) => x.iso === "IT")[0];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [ch.population, fr.population, de.population, it.population],
    labels: [ch.name, fr.name, de.name, it.name],
    colors: ["#FF6D6A", "#8BD3E6", "#E9EC6B", "#00B2A9"],
    title: "CH, FR, DE, IT Population",
  },
};

export const CustomSize: Story = {
  args: {
    data: [ch.population, fr.population, de.population, it.population],
    labels: [ch.name, fr.name, de.name, it.name],
    colors: ["#FF6D6A", "#8BD3E6", "#E9EC6B", "#00B2A9"],
    title: "CH, FR, DE, IT Population",
    width: 300,
    height: 300,
  },
};

export const HoverFunction: Story = {
  args: {
    data: [ch.population, fr.population, de.population, it.population],
    labels: [ch.name, fr.name, de.name, it.name],
    colors: ["#FF6D6A", "#8BD3E6", "#E9EC6B", "#00B2A9"],
    title: "CH, FR, DE, IT Population",
    textinfo: "percent",
    textposition: "inside",
    hoverFn: ([label, value]) => `${label}: ${value}%`,
  },
};
