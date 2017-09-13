import React, { Component } from "react";

import { Input } from "antd";

import { RMultiSelect, RSelect } from "./../../../components";

const { Group } = Input;

interface R {
  results: Array<{
    name: any;
    picture: any;
  }>;
}

export interface DemoOnlyProps {
  value?: string[];
  onSelectUser?(userNames: string[]): void;
}

export default class DemoOnly extends Component<DemoOnlyProps, any> {
  state = {
    isLoading: false,
    dataSource: [],
  };

  handleSearch = (keyword: string) => {
    // tslint:disable-next-line:no-console
    console.log("keyword:", keyword);
    this.setState({ isLoading: true });
    fetch("https://randomuser.me/api/?results=5")
      .then(resp => resp.json())
      .then(({ results = [] }: R) => {
        this.setState({ isLoading: false });
        // console.log(results);
        const dataSource = results.map(({ name = {}, picture = {} }) => {
          const { first, last } = name;
          const { thumbnail } = picture;
          return {
            label: (
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={thumbnail} alt="avatar" width="20" height="20" />{" "}
                {`${first} ${last}`}
              </span>
            ),
            value: `${first} ${last}`,
          };
        });
        // console.log(dataSource);
        this.setState({ dataSource });
      });
  };

  render() {
    const { isLoading, dataSource } = this.state;

    return (
      <Group compact>
        <RSelect
          style={{ width: "30%" }}
          dataSource={[{ label: "A", value: "a" }, { label: "B", value: "b" }]}
        />
        <RMultiSelect
          style={{ width: "70%" }}
          // size="large"
          value={this.props.value}
          isLoading={isLoading}
          dataSource={dataSource}
          onSearch={this.handleSearch}
          onChange={this.props.onSelectUser}
        />
      </Group>
    );
  }
}
