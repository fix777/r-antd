import React from "react";

import { RTable, } from "./../../../components";

const DemoOnly = () => (
  <div>
    <h1>Hello world...</h1>
    <RTable
      pagination={false}
      fixedMaxWidth={false}
      columns={[
        {
          title: "A",
          dataIndex: "a",
          width: 200,
          tooltip: true,
          fixed: "left",
          render: text => <a>{ text }</a>,
        },
        {
          title: "B",
          dataIndex: "b",
          width: 500,
        },
      ]}
      dataSource={[
        {
          a: "This is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
        {
          a: "This is a",
          b: "This is b",
        },
        {
          a: "This is A",
          b: "This is B",
        },
      ]}
    />
  </div>
);

export default DemoOnly;
