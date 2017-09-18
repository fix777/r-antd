import React, { ReactNode } from "react";
import { Tooltip } from "antd";

export interface ParamObject {
  maxWidth: number;
  preRender(): ReactNode;
  renderTooltip?(text: any, record: any, ...restArgs: any[]): ReactNode;
}

const wrapTooltip = ({ maxWidth, preRender, renderTooltip }: ParamObject) => (
  text: any,
  record: any,
  ...restArgs: any[]
) => {
  let tooltipTitle = text;
  if (typeof renderTooltip == "function")
    tooltipTitle = renderTooltip(text, record, ...restArgs);

  return (
    <Tooltip placement="topLeft" title={tooltipTitle}>
      <div
        style={{
          maxWidth,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {typeof preRender == "function" ? (
          preRender(text, record, ...restArgs)
        ) : (
          text
        )}
      </div>
    </Tooltip>
  );
};

export default wrapTooltip;
