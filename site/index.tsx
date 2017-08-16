import React from "react";
import { render } from "react-dom";

import { RTable, } from "./../components";

const App = () => (
  <div>
    <h1>Hello world...</h1>
    <RTable
      columns={[
        {
          title: "A",
          dataIndex: "a",
          width: 200,
          tooltip: true,
          fixed: "left",
        },
        {
          title: "B",
          dataIndex: "b",
          width: 500,
        },
      ]}
      dataSource={[
        {
          a: "This is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is aThis is a",
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

render(
  <App />,
  document.querySelector("#react-root")
);
