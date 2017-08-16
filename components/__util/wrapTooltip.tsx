import React, { ReactNode } from "react";
import { Tooltip } from "antd";

export interface ParamObject {
  maxWidth: number;
  preRender(): ReactNode;
}

const wrapTooltip =
({ maxWidth, preRender }: ParamObject) =>
  (text: any, ...restArgs) => (
    <Tooltip title={text}>
      <div style={{ maxWidth, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
        { typeof preRender == "function" ? preRender(text, ...restArgs) : text }
      </div>
    </Tooltip>
  );

export default wrapTooltip;
