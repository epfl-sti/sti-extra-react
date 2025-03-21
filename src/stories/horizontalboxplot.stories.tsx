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
  getContinents().reduce((obj, continent) => {
    obj[continent] = {
      population: countries
        .filter((x) => x.continent === continent)
        .map((x) => x.population),
      area: countries
        .filter((x) => x.continent === continent)
        .map((x) => x.area),
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
