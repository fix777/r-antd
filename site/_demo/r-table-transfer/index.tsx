import React, { Component } from "react";

import { RTableTransfer } from "./../../../components";
import "./../../../components/r-table-transfer/style";

class DemoOnly extends Component<{}, any> {
  state: any = {
    src: Array(10)
      .fill({})
      .map(obj => ({ ...obj, s1: Date.now() + Math.random() })),
    des: [],
  };

  updateSrcAndDes = (src: any[], des: any[]) => {
    this.setState({ src, des });
  };

  render() {
    const { src, des } = this.state;

    return (
      <RTableTransfer
        sourceRTableProps={{
          rowKey: "s1",
          columns: [{ title: "Some Title S", dataIndex: "s1" }],
          dataSource: src,
        }}
        destinationRTableProps={{
          rowKey: "s1",
          columns: [{ title: "Some Title D", dataIndex: "s1" }],
          dataSource: des,
        }}
        onToDestination={this.updateSrcAndDes}
        onToSource={this.updateSrcAndDes}
      />
    );
  }
}

export default DemoOnly;
