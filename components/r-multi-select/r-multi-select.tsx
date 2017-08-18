import React, {
  Component,
} from "react";
import classNames from "classnames";

// import "./style/index.less";

import { Spin } from "antd";

import RSelect, { RSelectProps } from "./../r-select/r-select";

export interface RMultiSelectProps extends RSelectProps {
  isLoading?: boolean;
}

export class RMultiSelect extends Component<RMultiSelectProps> {
  render() {
    const {
      isLoading = false,
      ...rest
    } = this.props;

    const clazz = classNames("r-multi-select");

    return (
      <RSelect
        className={clazz}
        style={{ width: "100%" }}
        mode="multiple"
        allowClear
        notFoundContent={isLoading && <Spin size="small" />}
        filterOption={false}
        {...rest}
      />
    );
  }
}

export default RMultiSelect;
