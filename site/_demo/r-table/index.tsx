import React from "react";
import { Button, Alert } from "antd";

import { RTable } from "./../../../components";
import "./../../../components/r-table/style";

const testExport = (options) => {
  /* tslint:disable */
  console.clear();
  console.log(
    "You are seeing this log because of the default `exportType` is `by-one-click`, so you should implement the `onExport` event to just request the export API."
  );
  console.log(
    "You can also set the `exportType` to `by-config` to enable advanced built-in export configuration modal."
  );
  console.log("options: ", options);
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
    exportType="by-config"
    exportOptions={{
      configModalPrev: (
        <Alert style={{ margin: "0 40px 8px" }} showIcon message="* 此处经常有 🐻 出没" />
      ),
      rangeTypes: ["C1", "RESULT", "SELECTED", "ALL"],
      customizedRanges: [{ label: "C1", value: "C1" }],
    }}
    onExport={testExport}
    cardTitle={<SomeActions />}
    pagination={{
      // type: "prev_next",
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
        renderTooltip: (_, { b }) => {
          return b;
        },
        render: (text) => <a>{text}</a>,
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
  />
);

export default DemoOnly;
