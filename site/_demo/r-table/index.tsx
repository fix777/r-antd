import React from "react";

import { RTable } from "./../../../es";

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
          fixed: "left",
          tooltip: true,
          renderTooltip: (text, { b }) => {
            // tslint:disable-next-line:no-console
            console.log(text);
            return b;
          },
          render: text => <a>{text}</a>,
        },
        {
          title: "B",
          dataIndex: "b",
          width: 2000,
        },
      ]}
      dataSource={[
        {
          a:
            "This is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is",
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
      rowSelection={{
        onChange: console.log,
      }}
    />
  </div>
);

export default DemoOnly;
