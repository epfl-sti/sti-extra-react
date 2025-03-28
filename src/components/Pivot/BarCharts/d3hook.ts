import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * A custom React hook for integrating D3.js rendering logic with React components.
 *
 * @param renderChartFn - A function that takes a D3 selection of the referenced HTML element
 * and applies D3 rendering logic to it.
 * @param dependencies - A dependency array that determines when the effect should re-run.
 * Changes to any value in this array will trigger the re-execution of the `renderChartFn`.
 * 
 * @returns A React ref object that should be attached to the HTML element where the D3 chart
 * will be rendered.
 */
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
