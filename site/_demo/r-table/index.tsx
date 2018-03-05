import React from "react";
import { Button } from "antd";

import { RTable } from "./../../../components";
import "./../../../components/r-table/style";

const testExport = () => {
  /* tslint:disable */
  console.clear();
  console.log(
    "You are seeing this log because of the default `exportType` is `by-one-click`, so you should implement the `onExport` event to just request the export API."
  );
  console.log(
    "You can also set the `exportType` to `by-config` to enable advanced built-in export configuration modal."
  );
  /* tslint:enable */
  // return false;
};

const SomeActions = () => (
  <div>
    <Button type="primary">EDIT</Button>
    <span style={{ display: "inline-block", marginLeft: 16 }} />
    <Button type="danger">DELETE</Button>
  </div>
);

const DemoOnly = () => (
  <RTable
    showEditColumns
    showExport
    // exportType="by-config"
    onExport={testExport}
    cardTitle={<SomeActions />}
    pagination={{
      total: 111,
    }}
    fixedMaxWidth={false}
    columns={[
      {
        title: "Column A",
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
        title: "Column B",
        dataIndex: "b",
        width: 200,
        fixed: "left",
        tooltip: true,
      },
      {
        title: "Column C",
        dataIndex: "c",
        width: 200,
        tooltip: true,
      },
      {
        title: "Column D",
        dataIndex: "d",
        width: 200,
        tooltip: true,
      },
      {
        title: "Column E",
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
);

export default DemoOnly;
