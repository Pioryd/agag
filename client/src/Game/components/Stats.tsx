import React from "react";
import { addEffect, addAfterEffect } from "react-three-fiber";
// @ts-ignore
import StatsImpl from "stats.js";

interface Props {
  showPanel?: number;
  className?: string;
  parentId?: string;
}

export default function Stats({ showPanel = 0, className, parentId }: Props) {
  const [stats] = React.useState(() => new StatsImpl());

  React.useEffect(() => {
    const node =
      (parentId && document.getElementById(parentId)) || document.body;

    stats.showPanel(showPanel);
    node.appendChild(stats.dom);

    if (className) stats.dom.classList.add(className);

    stats.dom.style.position = "absolute";
    stats.dom.style.top = 0;
    stats.dom.style.right = 0;
    stats.dom.style.left = "auto";

    const begin = addEffect(() => stats.begin());
    const end = addAfterEffect(() => stats.end());

    return () => {
      node.removeChild(stats.dom);
      begin();
      end();
    };
  }, [showPanel, className, parentId, stats]);

  return null;
}
