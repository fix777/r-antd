import React, { Component, CSSProperties, ReactNode } from "react";
import { findDOMNode } from "react-dom";
import omit from "lodash.omit";
import shallowequal from "shallowequal";
import { Table, Card, Button, Popover, Checkbox } from "antd";
import { TableProps, TableColumnConfig } from "antd/lib/table/table";

import { wrapTooltip, insertIndexAsKey } from "./../__util";

const hasFixedColumn = (columns: any[] = []) => columns.some(({ fixed }) => !!fixed);

const mapColumns = (columns: any[] = []) =>
  columns.map(column => {
    const { tooltip = false, renderTooltip, maxWidth, width, render } = column;
    if (!tooltip) return column;
    if (!width && !maxWidth) {
      throw new Error("Ops, width or maxWidth is required when you need wrap tooltip!");
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

const removeColumnFixedProps = (columns: any[] = []) => {
  if (!hasFixedColumn(columns)) return columns;
  return columns.map(column => {
    if ("fixed" in column) {
      return omit(column, ["fixed"]);
    }
    return column;
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
    .reduce((widthSum: number, { width = 0 }) => widthSum + Number(width), initalWidth);
  // console.log(unFixedColumnWidthSum);
  return unFixedColumnWidthSum;
};

function getCheckedColumnOrColumnKeys<T>(
  columns: Array<RColumnsProps<T>>,
  rtvType: "columns" | "columnKeys" = "columnKeys"
): Array<RColumnsProps<T>> | string[] {
  const visibleColumns = columns
    .map(({ visible, defaultVisible = true, ...rest }) => {
      const columnVisible = typeof visible == "boolean" ? visible : defaultVisible;
      return { visible: columnVisible, ...rest };
    })
    .filter(({ visible }) => visible)
    .map(column => omit(column, ["visible"]));

  if (rtvType === "columns") {
    return visibleColumns;
  } else if (rtvType === "columnKeys") {
    return visibleColumns.map(({ key, dataIndex }) => (key || dataIndex) as string);
  }

  return []; // you pass the incorrect `rtvType`
}

export interface RColumnsProps<T> extends TableColumnConfig<T> {
  defaultVisible?: boolean; // default to `true`
  visible?: boolean; // default to `undefined`
  maxWidth?: number;
  tooltip?: boolean;
  renderTooltip?(text?: any, record?: any, index?: number): ReactNode;
}

export interface RTableProps<T> extends TableProps<T> {
  showEditColumns?: boolean; // default to `false`
  fixedMaxWidth?: boolean;
  columns: Array<RColumnsProps<T>>;
}

export interface RTableState<T> {
  shouldRemoveColumnFixedProps: boolean;
  columns: Array<RColumnsProps<T>>;
}

export class RTable<T> extends Component<RTableProps<T>, RTableState<T>> {
  state: RTableState<T> = {
    shouldRemoveColumnFixedProps: false,
    columns: "columns" in this.props ? this.props.columns : [],
  };

  private table: any;

  componentDidMount() {
    const tableDomNode = findDOMNode(this.table);
    const xWidth = scrollX(this.props) || 0;
    if (tableDomNode.clientWidth - xWidth > 0) {
      this.setState({ shouldRemoveColumnFixedProps: true });
    }
  }

  componentWillReceiveProps(nextProps: RTableProps<T>) {
    const { columns } = this.props;
    if (!shallowequal(columns, nextProps.columns)) {
      this.setState({ columns: nextProps.columns });
    }
  }

  getPagination = () => {
    const { pagination } = this.props;
    if (typeof pagination == "boolean") return pagination;
    if (!pagination) return false;
    return {
      showSizeChanger: true,
      pageSizeOptions: ["6", "10", "20", "50", "100", "500", "1000"],
      showQuickJumper: true,
      showTotal: (total, [start, end]) => `${start}-${end} / ${total}`,
      ...pagination,
    };
  };

  handleCheckedColumnKeysChange = (checked: boolean, curColumnKey: string) => () => {
    this.setState(({ columns }) => {
      const nxtColumns = columns.map(({ visible, key, dataIndex, ...rest }) => {
        const columnKey = key || dataIndex;
        let nxtVisible = visible;
        if (columnKey === curColumnKey) {
          nxtVisible = checked;
        }
        return { visible: nxtVisible, key, dataIndex, ...rest };
      });

      return { columns: nxtColumns };
    });
  };

  renderCardExtra = () => {
    const { columns } = this.state;
    const checkedColumnKeys = getCheckedColumnOrColumnKeys<T>(columns) as string[];
    const mapColumnsCheckbox = ({ key, dataIndex, title }) => {
      const columnKey = key || dataIndex;
      const checked = checkedColumnKeys.includes(columnKey);
      return (
        <p key={columnKey}>
          <Checkbox
            checked={checked}
            value={columnKey}
            onChange={this.handleCheckedColumnKeysChange(!checked, columnKey)}
          >
            {title}
          </Checkbox>
        </p>
      );
    };
    const columnsCheckboxGroup = <div>{columns.map(mapColumnsCheckbox)}</div>;

    return (
      <Popover placement="bottom" trigger="click" content={columnsCheckboxGroup}>
        <Button>列设置</Button>
      </Popover>
    );
  };

  render() {
    const { showEditColumns = false, fixedMaxWidth = false, style, scroll, ...others } = this.props;
    const { shouldRemoveColumnFixedProps, columns } = this.state;

    const visibleColumns = getCheckedColumnOrColumnKeys(columns, "columns") as Array<
      RColumnsProps<T>
    >;
    let nextColumns = mapColumns(visibleColumns);
    if (shouldRemoveColumnFixedProps) {
      nextColumns = removeColumnFixedProps(nextColumns);
    }

    let rest = omit(others, ["columns", "pagination"]);
    if (!others.rowKey) {
      rest = {
        ...rest,
        dataSource: insertIndexAsKey(others.dataSource),
      };
    }

    const xWidth = scrollX(this.props);

    const defaultStyle: Partial<CSSProperties> = fixedMaxWidth
      ? { maxWidth: xWidth || "100%" }
      : {};

    const table = (
      <Table
        ref={tableRef => (this.table = tableRef)}
        style={{ ...style, ...defaultStyle }}
        size="middle"
        columns={nextColumns}
        pagination={this.getPagination()}
        scroll={{
          x: xWidth,
          ...scroll,
        }}
        {...rest}
      />
    );

    if (!showEditColumns) {
      return table;
    }

    return (
      <Card
        className={`r-antd_table--card`}
        bodyStyle={{ padding: 0 }}
        bordered={false}
        noHovering
        extra={this.renderCardExtra()}
      >
        {table}
      </Card>
    );
  }
}

export default RTable;
