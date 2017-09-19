import React from "react";

import { RTable } from "./../../../components";

const DemoOnly = () => (
  <div>
    <h1>Hello world...</h1>
    <RTable
      pagination={true}
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
          width: 200,
          fixed: "left",
          tooltip: true,
        },
        {
          title: "C",
          dataIndex: "c",
          width: 200,
          tooltip: true,
        },
        {
          title: "D",
          dataIndex: "d",
          width: 200,
          tooltip: true,
        },
        {
          title: "E",
          dataIndex: "e",
          width: 300,
          tooltip: true,
        },
      ]}
      dataSource={[
        {
          a: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Aperiam aliquam cum placeat reprehenderit. Aperiam facilis
            reprehenderit enim nam dolores ducimus neque,
            molestiae nostrum omnis aut, fuga autem perspiciatis veniam aliquam!`,
          b: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Aperiam aliquam cum placeat reprehenderit. Aperiam facilis
            reprehenderit enim nam dolores ducimus neque,
            molestiae nostrum omnis aut, fuga autem perspiciatis veniam aliquam!`,
          c: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Aperiam aliquam cum placeat reprehenderit. Aperiam facilis
            reprehenderit enim nam dolores ducimus neque,
            molestiae nostrum omnis aut, fuga autem perspiciatis veniam aliquam!`,
          d: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Aperiam aliquam cum placeat reprehenderit. Aperiam facilis
            reprehenderit enim nam dolores ducimus neque,
            molestiae nostrum omnis aut, fuga autem perspiciatis veniam aliquam!`,
          e: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Aperiam aliquam cum placeat reprehenderit. Aperiam facilis
            reprehenderit enim nam dolores ducimus neque,
            molestiae nostrum omnis aut, fuga autem perspiciatis veniam aliquam!`,
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
      ]}
      rowSelection={{
        onChange: console.log,
      }}
    />
  </div>
);

export default DemoOnly;
