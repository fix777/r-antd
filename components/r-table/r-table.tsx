import React, { Component, CSSProperties, ReactNode } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import omit from "lodash.omit";
import classNames from "classnames";
import { Table, Card, Button, Popover, Checkbox, Icon } from "antd";
import { TableProps, TableColumnConfig } from "antd/es/table/table";
import { PaginationProps } from "antd/es/pagination";

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
  prevNext: {
    prevText: "上一页",
    nextText: "下一页",
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

const scrollX = (props: RTableProps<{}>, state: RTableState): undefined | number => {
  const { columns = [], rowSelection, expandedRowRender } = props;
  const { invisibleColumnKeys } = state;

  const cols = columns.filter(
    (column: any) => !invisibleColumnKeys.includes(column.key || column.dataIndex)
  );

  // const hasFixedColumn = columns.some(({ fixed }) => !!fixed);
  if (!hasFixedColumn(cols)) return;

  let hasCheckbox = false;
  if (typeof rowSelection == "object" && rowSelection) hasCheckbox = true;

  let initalWidth = 0;
  if (hasCheckbox) initalWidth += 62;
  if (typeof expandedRowRender == "function") initalWidth += 50;

  const unFixedColumnWidthSum = cols
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

export interface ExportOptions {
  enabled?: boolean; // use this props over `showExport` in @1.0.0 version
  clickType?: "default" | "configurable"; // use this props over `exportType` in @1.0.0 version
  configModalTitle?: ReactNode;
  configModalPrev?: ReactNode;
  configModalExtra?: ReactNode;
}

export interface RPagination extends PaginationProps {
  type?: "default" | "prev_next";
  onPrevClick?(pageNo?: number, pageSize?: number): void;
  onNextClick?(pageNo?: number, pageSize?: number): void;
}

export interface RTableProps<T> extends TableProps<T> {
  cardTitle?: ReactNode;
  showEditColumns?: boolean; // default to `false`
  showExport?: boolean; // default to `false`
  exportType?: "by-one-click" | "by-config"; // default to `by-one-click`
  exportOptions?: ExportOptions;
  fixedMaxWidth?: boolean;
  columns: Array<RColumnsProps<T>>;
  pagination?: RPagination | boolean;

  onExport?(checkedColumnKeys?: string[], rangeType?: "ALL" | "SELECTED"): void | boolean;
}

export interface RTableState {
  shouldRemoveColumnFixedProps: boolean;
  invisibleColumnKeys: string[];
}

export interface TableContext {
  antLocale?: {
    Table?: any;
  };
}

export class RTable<T> extends Component<RTableProps<T>, RTableState> {
  static defaultProps: Partial<RTableProps<{}>> = {
    exportOptions: {
      enabled: false,
      clickType: "default",
    },
    prefixCls: "r-antd_table",
    columns: [],
    dataSource: [],
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  context: TableContext;

  state: RTableState = {
    shouldRemoveColumnFixedProps: false,
    invisibleColumnKeys: [],
  };

  private table: any;

  componentDidMount() {
    this.fixColumnFixed();
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
    if (typeof pagination == "boolean") {
      return pagination;
    }
    if (!pagination) {
      return false;
    }
    const { type } = pagination;
    if (type === "prev_next") {
      return false;
    }
    return {
      showSizeChanger: true,
      pageSizeOptions: ["6", "10", "20", "50", "100", "500", "1000"],
      showQuickJumper: true,
      showTotal: (total, [start, end]) => `${start}-${end} / ${total}`,
      ...omit(pagination, ["onPrevClick", "onNextClick"]),
    };
  };

  fixColumnFixed = () => {
    const tableDomNode = findDOMNode(this.table);
    const xWidth = scrollX(this.props, this.state) || 0;
    if (tableDomNode.clientWidth - xWidth > 0) {
      this.setState({ shouldRemoveColumnFixedProps: true });
    }
  };

  handleCheckedColumnKeysChange = (checked: boolean, curColumnKey: string) => () => {
    this.setState(({ invisibleColumnKeys }) => {
      const nxtVisibleColumnKeys = !checked
        ? [...invisibleColumnKeys, curColumnKey]
        : invisibleColumnKeys.filter(k => k != curColumnKey);

      return { invisibleColumnKeys: nxtVisibleColumnKeys };
    });
    this.fixColumnFixed();
  };

  renderEditColumnsAction = () => {
    const { showEditColumns } = this.props;

    if (!showEditColumns) {
      return null;
    }

    const { columns } = this.props;
    const { invisibleColumnKeys } = this.state;
    const mapColumnsCheckbox = ({ key, dataIndex, title }) => {
      const columnKey = key || dataIndex;
      const checked = !invisibleColumnKeys.includes(columnKey);
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
    const { showExport, exportOptions } = this.props;

    if (!showExport) {
      return null;
    }

    const { columns, exportType = "by-one-click", onExport = noop } = this.props;
    const locale = this.getLocale();

    return (
      <Export
        exportOptions={exportOptions as ExportOptions}
        locale={locale}
        columns={columns}
        exportType={exportType}
        onExport={onExport}
      />
    );
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

  onPrevClick = () => {
    const { current = 1, pageSize, onPrevClick } = this.props.pagination as RPagination;
    // if it is 1st page, we should stop here
    if (current === 1 || typeof onPrevClick != "function") {
      return;
    }
    onPrevClick(current - 1, pageSize);
  };

  onNextClick = () => {
    const { current = 1, pageSize, onNextClick } = this.props.pagination as RPagination;
    if (typeof onNextClick != "function") {
      return;
    }
    onNextClick(current + 1, pageSize);
  };

  renderPrevNextAction = () => {
    const { dataSource, pagination } = this.props;
    if (typeof "pagination" == "boolean") {
      return null;
    }
    const { type = "default", current, pageSize } = pagination as RPagination;
    if (type === "default") {
      return null;
    }
    const { prefixCls } = this.props;
    const containerClazz = classNames(prefixCls, `${prefixCls}--prev-next-container`);
    const btnsWrapperClazz = classNames(`${prefixCls}--prev-next-btns-wrapper`);
    const { prevNext } = this.getLocale();
    return (
      <div className={containerClazz}>
        <div className={btnsWrapperClazz}>
          <Button disabled={current === 1} onClick={this.onPrevClick}>
            <Icon type="left" />
            {prevNext.prevText}
          </Button>
          <Button
            disabled={(dataSource as any[]).length < (pageSize || 10)}
            onClick={this.onNextClick}
          >
            {prevNext.nextText}
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      showEditColumns = false,
      showExport = false,
      fixedMaxWidth = false,
      cardTitle,
      prefixCls,
      style,
      scroll,
      columns,
      ...others
    } = this.props;
    const { shouldRemoveColumnFixedProps, invisibleColumnKeys } = this.state;

    const visibleColumns = getCheckedColumnOrColumnKeys(columns, "columns") as Array<
      RColumnsProps<T>
    >;
    let nextColumns = mapColumns(visibleColumns).filter(
      column => !invisibleColumnKeys.includes(column.key || column.dataIndex)
    );
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

    const xWidth = scrollX(this.props, this.state);

    const defaultStyle: Partial<CSSProperties> = fixedMaxWidth
      ? { maxWidth: xWidth || "100%" }
      : {};

    const table = (
      <div>
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
        {this.renderPrevNextAction()}
      </div>
    );

    if (!cardTitle && !showEditColumns && !showExport) {
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
