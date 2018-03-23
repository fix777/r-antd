import React, { Component, CSSProperties, ReactNode } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import omit from "lodash.omit";
import shallowequal from "shallowequal";
import { Table, Card, Button, Popover, Checkbox } from "antd";
import { TableProps, TableColumnConfig } from "antd/lib/table/table";

import { wrapTooltip, insertIndexAsKey } from "./../__util";

import Export from "./export";

const defaultLocale = {
  editColumnsBtnText: "列设置",
  exportBtnText: "导出",
  exportModal: {
    submitText: "提交",
  },
  columnsType: {
    text: "列名",
    all: "全部",
    partial: "部分",
  },
  rangeType: {
    text: "范围",
    all: "全部记录",
    selected: "选中记录",
  },
};

// tslint:disable-next-line:no-empty
const noop = () => {};

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
  columns: Array<RColumnsProps<T>> = [],
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
  cardTitle?: ReactNode;
  showEditColumns?: boolean; // default to `false`
  showExport?: boolean; // default to `false`
  exportType?: "by-one-click" | "by-config"; // default to `by-one-click`
  fixedMaxWidth?: boolean;
  columns: Array<RColumnsProps<T>>;

  onExport?(checkedColumnKeys?: string[], rangeType?: "ALL" | "SELECTED"): void | boolean;
}

export interface RTableState<T> {
  shouldRemoveColumnFixedProps: boolean;
  columns: Array<RColumnsProps<T>>;
}

export interface TableContext {
  antLocale?: {
    Table?: any;
  };
}

export class RTable<T> extends Component<RTableProps<T>, RTableState<T>> {
  static defaultProps: Partial<RTableProps<{}>> = {
    prefixCls: "r-antd_table",
    columns: [],
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  context: TableContext;

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

  getLocale() {
    let locale = {};
    if (this.context.antLocale && this.context.antLocale.Table) {
      locale = this.context.antLocale.Table;
    }
    return {
      ...defaultLocale,
      ...locale,
      ...this.props.locale,
    };
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

  renderEditColumnsAction = () => {
    const { showEditColumns } = this.props;

    if (!showEditColumns) {
      return null;
    }

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
    const locale = this.getLocale();

    return (
      <Popover placement="bottom" trigger="click" content={columnsCheckboxGroup}>
        <Button>{locale.editColumnsBtnText}</Button>
      </Popover>
    );
  };

  renderExportAction = () => {
    const { showExport } = this.props;

    if (!showExport) {
      return null;
    }

    const { columns, exportType = "by-one-click", onExport = noop } = this.props;
    const locale = this.getLocale();

    return <Export locale={locale} columns={columns} exportType={exportType} onExport={onExport} />;
  };

  renderCardTitle = () => {
    return this.props.cardTitle;
  };

  renderCardExtra = () => {
    const { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}--card-extra`}>
        {this.renderEditColumnsAction()}
        {this.renderExportAction()}
      </div>
    );
  };

  render() {
    const {
      showEditColumns = false,
      showExport = false,
      fixedMaxWidth = false,
      prefixCls,
      style,
      scroll,
      ...others
    } = this.props;
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

    if (!showEditColumns && !showExport) {
      return table;
    }

    return (
      <Card
        className={`${prefixCls}--card`}
        bodyStyle={{ padding: 0 }}
        bordered={false}
        noHovering
        title={this.renderCardTitle()}
        extra={this.renderCardExtra()}
      >
        {table}
      </Card>
    );
  }
}

export default RTable;
