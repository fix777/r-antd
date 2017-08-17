import React, { Component } from "react";

import { Input } from "antd";

import { RForm, RSelect } from "./../../../components";
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
    this.setState(
      ({ fields }: any) => ({ fields: { ...fields, ...changedFields } })
    );
  }

  handleSelectUser = (userNames: string[]) => {
    this.updateFields({ user: { value: userNames } });
  }

  handleClear = () => {
    // 手动清除无法 decorate 的 form control 的 value
    this.setState(
      ({ fields }: any) => ({ fields: Object.assign({}, fields, {
        user: { value: [] },
      }) })
    );
  }

  handleSubmit = () => {
    // tslint:disable-next-line:no-console
    console.log("Fields: ", this.state.fields);
  }

  render() {
    return (
      <div style={{ padding: 15 }}>
        <RForm
          header="This is a r-form."
          footer={{
            defaultActionAlign: "right",
            showClear: true,
            clearText: "清空",
            onClear: this.handleClear,
            submitText: "搜索",
            onSubmit: this.handleSubmit,
          }}
          onFormChange={this.updateFields}
          formItems={[
            {
              label: "WHATEVER",
              id: "whatever",
              decorate: true,
              control: (
                <Input />
              ),
            },
            {
              label: "品牌",
              id: "vendor",
              decorate: true,
              control: (
                <RSelect
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
              label: "用户",
              id: "user",
              decorate: false,
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
        <pre id="pre-fields">
          {
            JSON.stringify(
              this.state.fields,
              null,
              2
            )
          }
        </pre>
      </div>
    );
  }
}
