import React from "react";
import { Tooltip } from "antd";

export interface ParamObject {
  maxWidth: number;
}

const wrapTooltip =
({ maxWidth }: ParamObject) =>
  (text: any) => (
    <Tooltip title={text}>
      <div style={{ maxWidth, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
        { text }
      </div>
    </Tooltip>
  );

export default wrapTooltip;
