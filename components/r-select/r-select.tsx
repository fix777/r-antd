import React, { Component, ReactNode } from "react";
import { Select } from "antd";
import { SelectProps, OptionProps } from "antd/lib/select";

const { Option } = Select;

export interface ROptionProps extends OptionProps {
  key?: string;
  title?: string;
  label: ReactNode;
}

export interface RSelectProps extends SelectProps {
  dataSource: ROptionProps[];
}

export class RSelect extends Component<RSelectProps> {
  static defaultProps: Partial<RSelectProps> = {
    dataSource: [],
  };

  renderOption = ({ key, value, label, ...rest }: ROptionProps) => {
    if (typeof key != "string" && typeof key != "number") key = value;
    return (
      <Option key={key} value={value} {...rest}>
        {label}
      </Option>
    );
  };

  render() {
    const { dataSource, ...rest } = this.props;

    return (
      <Select optionFilterProp="children" {...rest}>
        {dataSource.map(this.renderOption)}
      </Select>
    );
  }
}

export default RSelect;
