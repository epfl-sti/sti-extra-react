import type { StoryObj } from "@storybook/react";
import { XlsGenerator } from "../components/Xls/Generator/";
import generatorTestData from "./generatorTestData.json";

const meta = {
  title: "Xls/XlsGenerator",
  component: XlsGenerator,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: generatorTestData,
  },
};

export const CustomErrorHandler: Story = {
  args: {
    data: generatorTestData,
    errorHandler: (err: unknown) => console.error(err),
  },
};

export const OverrideXlsxAndJszipSources: Story = {
  args: {
    data: generatorTestData,
  },
};

export const CustomStyles: Story = {
  args: {
    data: generatorTestData,
    customButtonStyles: {
      position: "absolute",
      top: "10px",
      backgroundColor: "#0a0a23",
      color: "#fff",
      border: "none",
      padding: "10px",
      borderRadius: "10px",
    },
  },
};

export const CustomNames: Story = {
  args: {
    data: generatorTestData,
    bookName: "customBookName",
    sheetName: "customSheetName",
  },
};
