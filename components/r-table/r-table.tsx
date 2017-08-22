import React, {
  Component,
  CSSProperties,
} from "react";
import { Table } from "antd";
import {
  TableProps,
  TableColumnConfig,
} from "antd/lib/table/table";

import {
  wrapTooltip,
  insertIndexAsKey,
} from "./../__util";

export const mapColumns = (columns: any[] = []) => columns.map(column => {
  const { tooltip = false, width, render } = column;
  if (!tooltip) return column;
  if (!width) throw new Error("Ops, width is required when you need wrap tooltip!");
  return Object.assign({}, column, {
    render: wrapTooltip({ maxWidth: width, preRender: render }),
  });
});

export const scrollX = (columns: any[] = []): undefined | number => {
  const hasFixedColumn = columns.some(({ fixed }) => !!fixed);
  if (!hasFixedColumn) return;

  const unFixedColumnWidthSum =
    columns
      // .filter(({ fixed }) => !fixed)
      .reduce((widthSum: number, { width = 0 }) => widthSum + Number(width), 0);
  // console.log(unFixedColumnWidthSum);
  return unFixedColumnWidthSum;
};

export interface RColumnsProps<T> extends TableColumnConfig<T> {
  tooltip?: boolean;
}

export interface RTableProps<T> extends TableProps<T> {
  fixedMaxWidth?: boolean;
  columns: Array<RColumnsProps<T>>;
}

export class RTable<T> extends Component<RTableProps<T>, {}> {
  render() {
    const {
      fixedMaxWidth = false,
      style,
      columns,
      pagination,
      scroll,
      ...others
    } = this.props;

    let rest = others;
    if (!others.rowKey) {
      rest = Object.assign({}, rest, {
        dataSource: insertIndexAsKey(others.dataSource),
      });
    }
    if (!pagination) {
      rest = Object.assign({}, rest, {
        pagination,
      });
    }

    const xWidth = scrollX(columns);

    const defaultStyle: Partial<CSSProperties> = fixedMaxWidth ? { maxWidth: xWidth || "100%" } : {};

    return (
      <Table
        style={{ ...style, ...defaultStyle }}
        size="middle"
        columns={mapColumns(columns)}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          showQuickJumper: true,
          showTotal: (total, [start, end]) => `${start}-${end} / ${total}`,
          ...pagination as any
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
