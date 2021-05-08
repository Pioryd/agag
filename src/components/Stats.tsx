import React from "react";
import { addEffect, addAfterEffect } from "react-three-fiber";
// @ts-ignore
import StatsImpl from "stats.js";

interface Props {
  showPanel?: number;
  className?: string;
  parent?: React.MutableRefObject<HTMLElement>;
}

export default function Stats({ showPanel = 0, className, parent }: Props) {
  const [stats] = React.useState(() => new StatsImpl());

  React.useEffect(() => {
    const node = (parent && parent.current) || document.body;

    stats.showPanel(showPanel);
    node.appendChild(stats.dom);

    if (className) stats.dom.classList.add(className);

    const begin = addEffect(() => stats.begin());
    const end = addAfterEffect(() => stats.end());

    return () => {
      node.removeChild(stats.dom);
      begin();
      end();
    };
  }, [showPanel, className, parent, stats]);

  return null;
}
