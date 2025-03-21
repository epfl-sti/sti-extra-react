import type { StoryObj } from "@storybook/react";
import { ChoroplethMap } from "../components/Visualizations/ChoroplethMap";
import countries from "./testData.json";

const meta = {
  title: "Visualizations/ChoroplethMap",
  component: ChoroplethMap,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: countries,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "World Population",
    barTitle: "Habitants",
  },
};

export const DisableDrag: Story = {
  args: {
    data: countries,
    dragmode: false,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "World Population",
    barTitle: "Habitants",
  },
};

export const CustomColorScale: Story = {
  args: {
    data: countries,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "World Population",
    barTitle: "Habitants",
    colorscale: [
      [0, "rgb(5, 10, 172)"],
      [0.35, "rgb(40, 60, 190)"],
      [0.5, "rgb(70, 100, 245)"],
      [0.6, "rgb(90, 120, 245)"],
      [0.7, "rgb(106, 137, 247)"],
      [1, "rgb(220, 220, 220)"],
    ],
  },
};

export const HideColorBar: Story = {
  args: {
    data: countries,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "World Population",
    hideScale: true,
  },
};

export const CustomProjection: Story = {
  args: {
    data: countries,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "Custom Projection & Center",
    hideScale: true,
    projection: {
      type: "robinson",
      scale: 2.9,
      rotation: {
        lon: -63.590950297456786,
      },
    },
    center: {
      lon: -63.590950297456786,
      lat: -3.5131956482794737,
    },
  },
};

export const MissingDataDefLabel: Story = {
  args: {
    data: [
      { iso3: "COL", value: "100" },
      { iso3: "IRL", value: "200" },
    ],
    geoField: "iso3",
    dimensionField: "value",
    mapTitle: "Test Missing Data",
    hideScale: true,
  },
};

export const CustomPlotlyCDN: Story = {
  args: {
    data: countries,
    geoField: "iso3",
    dimensionField: "population",
    labelField: "name",
    mapTitle: "World Population",
    barTitle: "Habitants",
    plotlyCdnSource:
      "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.58.5/plotly.min.js",
  },
};
