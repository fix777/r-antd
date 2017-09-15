import React, { Component } from "react";
import { Row, Col, Button, Icon } from "antd";

import RTable, { RTableProps } from "./../r-table/r-table";

export interface RTableTransferProps<T> {
  sourceRTableProps: RTableProps<T>;
  destinationRTableProps: RTableProps<T>;
  toDesBtnText?: string;
  toSrcBtnText?: string;
  onToDestination(
    nextSourceRTableDataSource: any[],
    nextDestinationRTableDataSource: any[]
  ): void;
  onToSource(
    nextSourceRTableDataSource: any[],
    nextDestinationRTableDataSource: any[]
  ): void;
}

export interface RTableTransferState {
  sourceRTableSelectedRowKeys: string[];
  sourceRTableSelectedRows: any[];
  destinationRTableSelectedRowKeys: string[];
  destinationRTableSelectedRows: any[];
}

export default class RTableTransfer<T> extends Component<
  RTableTransferProps<T>,
  RTableTransferState
> {
  static defaultProps: Partial<RTableTransferProps<any>> = {
    toDesBtnText: "To Destination",
    toSrcBtnText: "To Source",
  };

  state: RTableTransferState = {
    sourceRTableSelectedRowKeys: [],
    sourceRTableSelectedRows: [],
    destinationRTableSelectedRowKeys: [],
    destinationRTableSelectedRows: [],
  };

  handleSourceRTableRowSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: any[]
  ) => {
    this.setState({
      sourceRTableSelectedRowKeys: selectedRowKeys,
      sourceRTableSelectedRows: selectedRows,
    });
  };

  handleDestinationRTableRowSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: any[]
  ) => {
    this.setState({
      destinationRTableSelectedRowKeys: selectedRowKeys,
      destinationRTableSelectedRows: selectedRows,
    });
  };

  handleToDestination = () => {
    const {
      sourceRTableProps,
      destinationRTableProps,
      onToDestination,
    } = this.props;
    const {
      sourceRTableSelectedRowKeys,
      sourceRTableSelectedRows,
    } = this.state;
    const {
      rowKey: srcRowKey = "id",
      dataSource: srcDS = [],
    } = sourceRTableProps;
    const { dataSource: desDS = [] } = destinationRTableProps;
    const nextSourceRTableDataSource = srcDS.filter(
      srcObj =>
        !sourceRTableSelectedRowKeys.includes(srcObj[srcRowKey as string])
    );
    onToDestination(nextSourceRTableDataSource, [
      ...desDS,
      ...sourceRTableSelectedRows,
    ]);
    this.setState({
      sourceRTableSelectedRowKeys: [],
      sourceRTableSelectedRows: [],
    });
  };

  handleToSource = () => {
    const {
      sourceRTableProps,
      destinationRTableProps,
      onToSource,
    } = this.props;
    const {
      destinationRTableSelectedRowKeys,
      destinationRTableSelectedRows,
    } = this.state;
    const {
      rowKey: srcRowKey = "id",
      dataSource: desDS = [],
    } = destinationRTableProps;
    const { dataSource: srcDS = [] } = sourceRTableProps;
    const nextDesRTableDataSource = desDS.filter(
      desObj =>
        !destinationRTableSelectedRowKeys.includes(desObj[srcRowKey as string])
    );
    onToSource(
      [...srcDS, ...destinationRTableSelectedRows],
      nextDesRTableDataSource
    );
    this.setState({
      destinationRTableSelectedRowKeys: [],
      destinationRTableSelectedRows: [],
    });
  };

  render() {
    const {
      sourceRTableProps,
      destinationRTableProps,
      toDesBtnText,
      toSrcBtnText,
    } = this.props;
    const {
      sourceRTableSelectedRowKeys,
      destinationRTableSelectedRowKeys,
    } = this.state;

    return (
      <Row className="r-antd-r-table-transfer-row">
        <Col span={24}>
          <RTable
            {...sourceRTableProps}
            rowSelection={{
              selectedRowKeys: sourceRTableSelectedRowKeys,
              onChange: this.handleSourceRTableRowSelectionChange,
            }}
          />
        </Col>
        <Col span={24}>
          <Button onClick={this.handleToDestination}>
            <Icon type="down" /> {toDesBtnText}
          </Button>
          <Button onClick={this.handleToSource}>
            <Icon type="up" /> {toSrcBtnText}
          </Button>
        </Col>
        <Col span={24}>
          <RTable
            {...destinationRTableProps}
            rowSelection={{
              selectedRowKeys: destinationRTableSelectedRowKeys,
              onChange: this.handleDestinationRTableRowSelectionChange,
            }}
          />
        </Col>
      </Row>
    );
  }
}
