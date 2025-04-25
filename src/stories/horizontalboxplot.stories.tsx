import type { StoryObj } from "@storybook/react";
import { HorizontalBoxplot } from "../components/Visualizations/Boxplot/HorizontalBoxplot";
import countries from "./testData.json";

const meta = {
  title: "Visualizations/HorizontalBoxPlot",
  component: HorizontalBoxplot,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const getContinents = () =>
  Array.from(new Set(countries.map((x) => x.continent)));

const getDataByContinent = () =>
  getContinents().reduce((obj: Record<string, { population: number[]; area: number[] }>, continent) => {
    obj[continent] = {
      population: countries
        .filter((x) => x.continent === continent)
        .map((x) => x.population),
      area: countries
        .filter((x) => x.continent === continent)
        .map((x) => Number(x.area)),
    };
    return obj;
  }, {});

export const Simple: Story = {
  args: {
    data: getDataByContinent(),
    dimensions: ["population"],
    width: 800,
    height: 500,
    xylegend: { x: "population", y: "continent" },
    title: "Population by Continent",
  },
};

export const DefineDataKeys: Story = {
  args: {
    data: getDataByContinent(),
    dataKeys: ["EU", "SA", "NA"],
    colors: ["#FCD116", "#003893", "#CE1126"],
    dimensions: ["population"],
    width: 800,
    height: 500,
    xylegend: { x: "population", y: "continent" },
    title: "Population by Continent (Europe, South America, North America)",
  },
};
