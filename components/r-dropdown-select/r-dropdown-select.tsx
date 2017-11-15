import React, { PureComponent } from "react";
import { Dropdown, Icon } from "antd";
// import { DropDownProps } from "antd/es/dropdown/dropdown";

import RMenu, { RMenuChild } from "./../r-menu/r-menu";

export interface DropdownPropsWithoutOverlay {
  trigger?: Array<"click" | "hover">;
  style?: React.CSSProperties;
  onVisibleChange?: (visible?: boolean) => void;
  visible?: boolean;
  disabled?: boolean;
  // tslint:disable-next-line:ban-types
  align?: Object;
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  prefixCls?: string;
  className?: string;
  placement?: "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight";
}

export interface RDropdownSelectProps {
  dataSource: RMenuChild[];
  value: string;
  iconType?: string;
  dropdownProps?: DropdownPropsWithoutOverlay;
}

interface PartialRDropdownSelectProps {
  dataSource: RMenuChild[];
  value: string;
}

const getMenus = (props: PartialRDropdownSelectProps) => {
  const validMenuItems = props.dataSource.filter(({ key }) => key !== props.value);
  return <RMenu dataSource={validMenuItems} />;
};

const renderSelectedMenuItem = (props: PartialRDropdownSelectProps) => {
  const current = props.dataSource.find(({ key }) => key === props.value);
  if (!current) {
    return "";
  }
  return current.children;
};

export default class RDropdownSelect extends PureComponent<RDropdownSelectProps> {
  static defaultProps: Partial<RDropdownSelectProps> = {
    dataSource: [],
    iconType: "caret-down",
  };

  render() {
    const { iconType, dropdownProps, ...rest } = this.props;

    return (
      <Dropdown overlay={getMenus(rest)} {...dropdownProps}>
        <a>
          {renderSelectedMenuItem(rest)} <Icon type={iconType as string} />
        </a>
      </Dropdown>
    );
  }
}
