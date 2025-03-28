import { useState, ReactNode } from 'react';
import Popover from 'react-popover';

interface PopOverProps {
  showPopOver: boolean;
  dataArray: { key: string; value: string }[];
  children: ReactNode;
}

export default function PopOver({ showPopOver, dataArray, children }: PopOverProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  const getPopOver = () => (
    <div
      className="popoverBox"
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <table className="popOverBox-table">
        <tbody>
          {dataArray.map((item, i) => (
            <tr key={`tr-${i}`}>
              <td className="popOverBox-table-cell" key={`tdk-${i}`}>
                {item.key}:
              </td>
              <td className="popOverBox-table-cell" key={`tdv-${i}`}>
                <b>{item.value}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Popover
      isOpen={showPopOver ? hovered : false}
      place="below"
      tipSize={0.01}
      enterExitTransitionDurationMs={0}
      body={getPopOver()}
    >
      <div onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
        {children}
      </div>
    </Popover>
  );
}
