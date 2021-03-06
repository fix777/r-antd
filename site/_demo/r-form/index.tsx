import React, { Component } from "react";

import { Input } from "antd";

import { RForm, RSelect } from "./../../../es";
// import "./../../../lib/r-form/style/css";
import UserSelect from "./../r-multi-select";

export default class DemoOnly extends Component<{}, any> {
  state = {
    fields: {
      user: {
        value: [],
      },
    },
  };

  updateFields = (changedFields: any) => {
    this.setState(({ fields }: any) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  handleSelectUser = (userNames: string[]) => {
    this.updateFields({ user: { value: userNames } });
  };

  handleClear = () => {
    // 手动清除无法 decorate 的 form control 的 value
    this.setState(({ fields }: any) => ({
      fields: {
        ...fields,
        user: { value: [] },
      },
    }));
  };

  handleSubmit = () => {
    // tslint:disable-next-line:no-console
    console.log("Fields: ", this.state.fields);
  };

  render() {
    return (
      <div style={{ padding: 15 }}>
        <RForm
          // style={{ maxWidth: 300 }}
          // layout="vertical"
          // layout="inline"
          background="normal"
          header="This is a r-form."
          footer={{
            defaultActionAlign: "right",
            showClear: true,
            showAdvancedToggle: true,
            advancedToggleTexts: ["展开", "收起"],
            clearText: "清空",
            onClear: this.handleClear,
            submitText: "查询",
            // submitDisabled: true,
            onSubmit: this.handleSubmit,
          }}
          onFormChange={this.updateFields}
          onValuesChange={console.log}
          defaultRenderFormItemCount={1}
          formItems={[
            {
              visible: true,
              // itemSpan: 24,
              label: "WHATEVER",
              id: "whatever",
              decorate: true,
              control: (
                <Input
                // style={{ width: "100%" }}
                />
              ),
            },
            {
              visible: true,
              // itemSpan: 24,
              label: "品牌",
              id: "vendor",
              decorate: true,
              control: (
                <RSelect
                  // style={{ width: "100%" }}
                  dataSource={[
                    {
                      label: "Li Ning",
                      value: "li-ning",
                    },
                    {
                      label: "Adidas",
                      value: "adidas",
                    },
                  ]}
                />
              ),
            },
            {
              visible: false,
              // itemSpan: 24,
              label: "用户",
              id: "user",
              control: (
                <UserSelect
                  value={this.state.fields.user.value}
                  onSelectUser={this.handleSelectUser}
                />
              ),
            },
          ]}
        />
        <div style={{ margin: "15px 0", borderBottom: "1px solid #ededed" }} />
        <label htmlFor="pre-fields">this.state.fields:</label>
        <pre id="pre-fields">{JSON.stringify(this.state.fields, null, 2)}</pre>
      </div>
    );
  }
}
