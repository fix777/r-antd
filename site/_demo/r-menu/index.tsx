import React, { Component } from "react";

import RMenu, { RSubMenuChild, RMenuChild } from "./../../../components/r-menu/r-menu";

const dataSource: RMenuChild[] = [
  {
    type: "menuitem",
    key: "MenuItem 1",
    children: "Option 1",
  },
  {
    type: "submenu",
    key: "SubMenu 1",
    title: "SubMenu 1",
    children: [
      {
        type: "menuitem",
        key: "MenuItem 2",
        children: "Option 2",
      },
      {
        type: "menuitem",
        key: "MenuItem 3",
        children: "Option 3",
      },
    ] as RSubMenuChild[],
  },
  {
    type: "submenu",
    key: "SubMenu 2",
    title: "SubMenu 2",
    children: [
      {
        type: "submenu",
        key: "SubMenu 3",
        title: "SubMenu 3",
        children: [
          {
            type: "menuitem",
            key: "MenuItem 4",
            children: "Option 4",
          },
          {
            type: "itemgroup",
            key: "ItemGroup 1",
            title: "ItemGroup 1",
            children: [
              {
                type: "menuitem",
                key: "MenuItem 5",
                children: "Option 5",
              },
            ],
          },
          {
            type: "itemgroup",
            key: "ItemGroup 2",
            title: "ItemGroup 2",
            children: [
              {
                type: "menuitem",
                key: "MenuItem 6",
                children: "Option 6",
              },
            ],
          },
        ],
      },
      {
        type: "menuitem",
        key: "MenuItem 7",
        children: "Option 7",
      },
    ] as RSubMenuChild[],
  },
];

export default class DemoOnly extends Component {
  render() {
    return (
      <RMenu
        theme="dark"
        mode="inline"
        dataSource={dataSource}
      />
    );
  }
}
