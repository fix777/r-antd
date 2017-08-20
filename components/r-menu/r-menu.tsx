import React, {
  Component,
  ReactNode,
} from "react";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";

export interface MenuItem {
  disabled?: boolean;
  key: string;
  children: ReactNode;
}

export interface ItemGroup {
  title: ReactNode;
  children: MenuItem[];
}

export interface SubMenu {
  disabled?: boolean;
  key: string;
  title: ReactNode;
  // children: Array<SubMenu | MenuItem | ItemGroup>;
  onTitleClick?({ key, domEvent }): void;
}

export interface RMenuItem extends MenuItem {
  type: "menuitem";
}

export interface RItemGroup extends ItemGroup {
  type: "itemgroup";
}

export type RSubMenuChild = RMenuItem | RSubMenu | RItemGroup;
export interface RSubMenu extends SubMenu {
  type: "submenu";
  children: RSubMenuChild[];
}

export type RMenuChild = RMenuItem | RSubMenu;
export interface RMenuProps extends MenuProps {
  dataSource: RMenuChild[];
}

export class RMenu extends Component<RMenuProps, {}> {
  renderMenuItem = ({ children, ...rest }: MenuItem) =>
    (<Menu.Item {...rest}>{ children }</Menu.Item>)

  renderSubMenu = ({ children, ...rest }: RSubMenu) =>
    (<Menu.SubMenu {...rest}>{ this.renderSubMenus(children) }</Menu.SubMenu>)

  renderItemGroup = ({ children, ...rest }: RItemGroup) =>
    (<Menu.ItemGroup {...rest}>{ children.map(this.renderMenuItem) }</Menu.ItemGroup>)

  renderSubMenus = (subMenus: Array<RMenuItem | RSubMenu | RItemGroup>) =>
    subMenus.map(({ type = "menuitem", ...rest }) => {
      switch (type) {
        case "menuitem":
          return this.renderMenuItem(rest as RMenuItem);
        case "submenu":
          return this.renderSubMenu(rest as RSubMenu);
        case "itemgroup":
          return this.renderItemGroup(rest as RItemGroup);
      }
      // if (type === "menuitem") return this.renderMenuItem(rest as RMenuItem);
      // else if (type === "submenu") return this.renderSubMenu(rest as RSubMenu);
      // else if (type === "itemgroup") return this.renderItemGroup(rest as RItemGroup);
    })

  renderMenus = (dataSource: RMenuChild[]) => {
    const renderMenu = (({ type = "menuitem", ...rest }: (RMenuItem | RSubMenu)) => {
      if (type === "menuitem") return this.renderMenuItem(rest as RMenuItem);

      return this.renderSubMenu(rest as RSubMenu);
    });

    return dataSource.map(renderMenu);
  }

  render() {
    const {
      dataSource,
      ...rest
    } = this.props;

    return (
      <Menu {...rest}>
        { this.renderMenus(dataSource) }
      </Menu>
    );
  }
}

export default RMenu;
