import React, {
  Component,
  CSSProperties,
  ReactNode,
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
  const { tooltip = false, renderTooltip, width, render } = column;
  if (!tooltip) return column;
  if (!width) throw new Error("Ops, width is required when you need wrap tooltip!");
  return Object.assign({}, column, {
    render: wrapTooltip({
      maxWidth: Number(width) - 20,
      preRender: render,
      renderTooltip,
    }),
  });
});

export const scrollX = (props: RTableProps<{}>): undefined | number => {
  const {
    columns = [],
    rowSelection,
    expandedRowRender,
  } = props;

  const hasFixedColumn = columns.some(({ fixed }) => !!fixed);
  if (!hasFixedColumn) return;

  let hasCheckbox = false;
  if (typeof rowSelection == "object" && rowSelection) hasCheckbox = true;

  let initalWidth = 0;
  if (hasCheckbox) initalWidth += 62;
  if (typeof expandedRowRender == "function") initalWidth += 50;

  const unFixedColumnWidthSum =
    columns
      // .filter(({ fixed }) => !fixed)
      .reduce((widthSum: number, { width = 0 }) => widthSum + Number(width), initalWidth);
  // console.log(unFixedColumnWidthSum);
  return unFixedColumnWidthSum;
};

export interface RColumnsProps<T> extends TableColumnConfig<T> {
  tooltip?: boolean;
  renderTooltip?(text?: any, record?: any, index?: number): ReactNode;
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

    const xWidth = scrollX(this.props);

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
