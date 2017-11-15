import React, { PureComponent } from "react";

import { RDropdownSelect } from "./../../../es";
// import RDropdownSelect from "./../../../components/r-dropdown-select";

export default class Demo extends PureComponent<{}, any> {
  state: any = {
    selected: "2",
  };

  handleChange = (selected: string) => () => {
    this.setState({ selected });
  };

  render() {
    const { selected } = this.state;

    return (
      <RDropdownSelect
        dropdownProps={{
          trigger: ["click"],
        }}
        dataSource={[
          {
            type: "menuitem",
            key: "1",
            children: <span onClick={this.handleChange("1")}>This is the 1st item.</span>,
          },
          {
            type: "menuitem",
            key: "2",
            children: <span onClick={this.handleChange("2")}>This is the 2nd item.</span>,
          },
          {
            type: "menuitem",
            key: "3",
            children: <span onClick={this.handleChange("3")}>This is the 3rd item.</span>,
          },
        ]}
        value={selected}
      />
    );
  }
}
