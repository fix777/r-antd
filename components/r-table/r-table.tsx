import React, { Component } from "react";
import { Table } from "antd";

import {
  wrapTooltip,
  insertIndexAsKey,
} from "./../__util";

export const mapColumns = (columns: any[] = []) => columns.map(column => {
  const { tooltip = false, width } = column;
  if (!tooltip) return column;
  if (!width) throw new Error("Ops, width is required when you need wrap tooltip!");
  return Object.assign({}, column, {
    render: wrapTooltip({ maxWidth: width }),
  });
});

export const scrollX = (columns: any[] = []): undefined | number => {
  const hasFixedColumn = columns.some(({ fixed }) => !!fixed);
  if (!hasFixedColumn) return;

  const unFixedColumnWidthSum =
    columns
      //.filter(({ fixed }) => !fixed)
      .reduce((widthSum: number, { width = 0 }) => widthSum + Number(width), 0);
  // console.log(unFixedColumnWidthSum);
  return unFixedColumnWidthSum;
};

export class RTable extends Component<any, any> {
  render() {
    const {
      columns,
      pagination,
      scroll,
      ...others
    } = this.props;

    let rest = others;
    if (!others.rowKey) {
      rest = Object.assign({}, others, {
        dataSource: insertIndexAsKey(others.dataSource),
      });
    }

    const xWidth = scrollX(columns);

    return (
      <Table
        style={{
          maxWidth: xWidth || "100%",
        }}
        size="middle"
        columns={mapColumns(columns)}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          showQuickJumper: true,
          showTotal: (total, [start, end]) => `${start}-${end} / ${total}`,
          ...pagination
        }}
        scroll={{
          x: xWidth,
          ...scroll
        }}
        {...rest}
      />
    );
  }
}

export default RTable;
