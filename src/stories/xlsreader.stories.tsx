import { XlsReader, XlsReaderProps } from "../components/Xls/Reader/";

const meta = {
  title: "Xls/XlsReader",
  component: XlsReader,
  argTypes: {
    callbackFn: { action: "handleUpload" },
  },
};

function handleUpload(res: any[]) {
  const text = res.map((row: any[]) => row.join(",")).join("\n");
  const textarea = document.getElementById("tadestination");
  if (textarea) {
    textarea.innerHTML = text;
  }
}

export default meta;

type Story = {
  args: XlsReaderProps;
  render: (args: XlsReaderProps) => JSX.Element;
};

const ReaderTemplate: Story = {
  args: {
    arrayOfArrays: true,
    labelString: "Choose any xls or xlsx file.",
    callbackFn: handleUpload,
  },
  render: (args) => (
    <div>
      <XlsReader {...args} />
      <textarea id="tadestination" rows={10} cols={80} />
    </div>
  ),
};

export const Default = ReaderTemplate;
