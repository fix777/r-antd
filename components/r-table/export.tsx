import * as React from "react";
import { Button, Modal, Radio, Checkbox } from "antd";

import RForm from "./../r-form";

import { ExportOptions } from "./r-table";

export interface ExportProps {
  locale: any;
  columns: any[];
  exportType: "by-one-click" | "by-config";
  exportOptions: ExportOptions;

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
    const { locale, exportType } = this.props;

    if (exportType === "by-one-click") {
      return <Button onClick={this.handleOneClickExport}>{locale.exportBtnText}</Button>;
    }

    const { exportOptions, columns } = this.props;
    const { configModalTitle } = exportOptions;
    const { visible, formFields } = this.state;

    return (
      <div style={{ display: "inline-block" }}>
        <Button onClick={this.handleToggleVisible}>{locale.exportBtnText}</Button>
        <Modal
          title={configModalTitle || locale.exportBtnText}
          footer={null}
          visible={visible}
          onCancel={this.handleToggleVisible}
        >
          <RForm
            style={{
              minWidth: 500,
              maxWidth: "75%",
            }}
            onValuesChange={this.handleFormValuesChange}
            footer={{
              defaultActionSpan: 20,
              defaultActionOffset: 4,
              submitText: locale.exportModal.submitText,
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
                label: locale.columnsType.text,
                control: (
                  <Radio.Group
                    options={[
                      { label: locale.columnsType.all, value: "ALL" },
                      { label: locale.columnsType.partial, value: "PARTIAL" },
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
                label: locale.rangeType.text,
                control: (
                  <Radio.Group
                    options={[
                      { label: locale.rangeType.all, value: "ALL" },
                      { label: locale.rangeType.selected, value: "SELECTED" },
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
