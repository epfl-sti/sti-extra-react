import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function useD3(
  renderChartFn: (selection: d3.Selection<HTMLElement, unknown, null, undefined>) => void,
  dependencies: React.DependencyList
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      renderChartFn(d3.select(ref.current));
    }
    return () => {};
  }, dependencies);

  return ref;
}
