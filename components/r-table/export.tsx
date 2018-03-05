import * as React from "react";
import { Button, Modal, Radio, Checkbox } from "antd";

import RForm from "./../r-form";

export interface ExportProps {
  columns: any[];
  exportType: "by-one-click" | "by-config";

  onExport(checkedColumnKeys?: string[], rangeType?: "ALL" | "SELECTED"): void | boolean;
}

export interface ExportState {
  visible: boolean;
  formFields: {
    columnsType: "ALL" | "PARTIAL";
    checkedColumnKeys: string[];
    rangeType: "ALL" | "SELECTED";
  };
}

export default class Export extends React.Component<ExportProps, ExportState> {
  state: ExportState = {
    visible: false,
    formFields: {
      columnsType: "ALL",
      checkedColumnKeys: [],
      rangeType: "ALL",
    },
  };

  handleToggleVisible = () => {
    this.setState(({ visible }) => ({ visible: !visible }));
  };

  handleExportSubmit = () => {
    const { columns, onExport } = this.props;
    const { formFields } = this.state;
    const { columnsType, checkedColumnKeys, rangeType } = formFields;
    const nxtCheckedColumnKeys =
      columnsType === "ALL"
        ? columns.map(({ key, dataIndex }) => key || dataIndex)
        : checkedColumnKeys;
    const exportResult = onExport(nxtCheckedColumnKeys, rangeType);
    if (!exportResult) {
      return;
    }
    this.handleToggleVisible(); // close the dialog window.
  };

  handleFormValuesChange = ([formItemId, formFieldValue]: [string, any]) => {
    this.setState(({ formFields }) => ({
      formFields: { ...formFields, [formItemId]: formFieldValue },
    }));
  };

  handleOneClickExport = () => {
    this.props.onExport();
  };

  render() {
    const { exportType } = this.props;

    if (exportType === "by-one-click") {
      return <Button onClick={this.handleOneClickExport}>Export</Button>;
    }

    const { columns } = this.props;
    const { visible, formFields } = this.state;

    return (
      <div style={{ display: "inline-block" }}>
        <Button onClick={this.handleToggleVisible}>Export</Button>
        <Modal title="Export" footer={null} visible={visible} onCancel={this.handleToggleVisible}>
          <RForm
            style={{
              minWidth: 500,
              maxWidth: "75%",
            }}
            onValuesChange={this.handleFormValuesChange}
            footer={{
              defaultActionSpan: 20,
              defaultActionOffset: 4,
              onSubmit: this.handleExportSubmit,
            }}
            formItems={[
              {
                itemSpan: 24,
                decorate: true,
                decoratorOptions: {
                  initialValue: formFields.columnsType,
                },
                id: "columnsType",
                label: "Column(s)",
                control: (
                  <Radio.Group
                    options={[
                      { label: "All", value: "ALL" },
                      { label: "Partial", value: "PARTIAL" },
                    ]}
                  />
                ),
              },
              {
                visible: formFields.columnsType === "PARTIAL",
                itemSpan: 24,
                decorate: true,
                id: "checkedColumnKeys",
                label: " ",
                colon: false,
                control: (
                  <Checkbox.Group
                    options={columns.map(({ title, key, dataIndex }) => ({
                      label: title,
                      value: key || dataIndex,
                    }))}
                  />
                ),
              },
              {
                itemSpan: 24,
                decorate: true,
                decoratorOptions: {
                  initialValue: formFields.rangeType,
                },
                id: "rangeType",
                label: "Range",
                control: (
                  <Radio.Group
                    options={[
                      { label: "All rows", value: "ALL" },
                      { label: "Selected rows", value: "SELECTED" },
                    ]}
                  />
                ),
              },
            ]}
          />
        </Modal>
      </div>
    );
  }
}
