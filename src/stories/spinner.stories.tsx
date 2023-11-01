import type { StoryObj } from "@storybook/react";
import Spinner from "../components/utils/spinner";

const meta = {
  title: "Utils/Spinner",
  component: Spinner,
  tags: ["docsPage"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {};
