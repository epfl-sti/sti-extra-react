import type { StoryObj } from "@storybook/react";
import { HorizontalBoxplotGrouped } from "../components/Visualizations/Boxplot/HorizontalBoxplotGrouped";
import countries from "./testData.json";

const meta = {
  title: "Visualizations/HorizontalBoxPlotGrouped",
  component: HorizontalBoxplotGrouped,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const getContinents = () =>
  Array.from(new Set(countries.map((x) => x.continent)));

const getDataByContinent = (lang) =>
  getContinents().reduce((obj, continent) => {
    obj[continent] = {
      population: countries
        .filter(
          (x) => x.continent === continent && x.languagecodes.includes(lang),
        )
        .map((x) => x.population),
      area: countries
        .filter(
          (x) => x.continent === continent && x.languagecodes.includes(lang),
        )
        .map((x) => x.area),
    };
    return obj;
  }, {});

export const Grouped: Story = {
  args: {
    data: {
      en: getDataByContinent("en"),
      es: getDataByContinent("es"),
      fr: getDataByContinent("fr"),
    },
    dimensions: ["population"],
    width: 800,
    height: 500,
    xylegend: { x: "population", y: "continent" },
    title: "Population by Continent",
  },
};
