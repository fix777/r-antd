import React, { Component, CSSProperties, ReactNode } from "react";
import omit from "lodash.omit";
import { Table } from "antd";
import { TableProps, TableColumnConfig } from "antd/lib/table/table";

import { wrapTooltip, insertIndexAsKey } from "./../__util";

const hasFixedColumn = (columns: any[] = []) =>
  columns.some(({ fixed }) => !!fixed);

const mapColumns = (columns: any[] = []) =>
  columns.map(column => {
    const { tooltip = false, renderTooltip, maxWidth, width, render } = column;
    if (!tooltip) return column;
    if (!width && !maxWidth) {
      throw new Error(
        "Ops, width or maxWidth is required when you need wrap tooltip!"
      );
    }
    const nextColumn = {
      ...column,
      render: wrapTooltip({
        maxWidth: Number(maxWidth || width) - 20,
        preRender: render,
        renderTooltip,
      }),
    };
    return omit(nextColumn, ["maxWidth", "tooltip", "renderTooltip"]);
  });

const removeUnnecessaryColumnWidth = (columns: any[] = []) => {
  if (!hasFixedColumn(columns)) return columns;
  return columns.map(column => {
    if ("fixed" in column) {
      return column;
    }
    return omit(column, ["width"]);
  });
};

const scrollX = (props: RTableProps<{}>): undefined | number => {
  const { columns = [], rowSelection, expandedRowRender } = props;

  // const hasFixedColumn = columns.some(({ fixed }) => !!fixed);
  if (!hasFixedColumn(columns)) return;

  let hasCheckbox = false;
  if (typeof rowSelection == "object" && rowSelection) hasCheckbox = true;

  let initalWidth = 0;
  if (hasCheckbox) initalWidth += 62;
  if (typeof expandedRowRender == "function") initalWidth += 50;

  const unFixedColumnWidthSum = columns
    // .filter(({ fixed }) => !fixed)
    .reduce(
      (widthSum: number, { width = 0 }) => widthSum + Number(width),
      initalWidth
    );
  // console.log(unFixedColumnWidthSum);
  return unFixedColumnWidthSum;
};

export interface RColumnsProps<T> extends TableColumnConfig<T> {
  maxWidth?: number;
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
      ...others,
    } = this.props;

    let rest = others;
    if (!others.rowKey) {
      rest = {
        ...rest,
        dataSource: insertIndexAsKey(others.dataSource),
      };
    }
    if (!pagination) {
      rest = Object.assign({}, rest, {
        pagination,
      });
    }

    const xWidth = scrollX(this.props);

    const defaultStyle: Partial<CSSProperties> = fixedMaxWidth
      ? { maxWidth: xWidth || "100%" }
      : {};

    return (
      <Table
        style={{ ...style, ...defaultStyle }}
        size="middle"
        columns={removeUnnecessaryColumnWidth(mapColumns(columns))}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100", "500", "1000"],
          showQuickJumper: true,
          showTotal: (total, [start, end]) => `${start}-${end} / ${total}`,
          ...pagination as any,
        }}
        scroll={{
          x: xWidth,
          ...scroll,
        }}
        {...rest}
      />
    );
  }
}

export default RTable;
