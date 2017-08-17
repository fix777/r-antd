import React, { Component } from "react";

import { RMultiSelect } from "./../../../components";

interface R {
  results: Array<{
    name: any;
    picture: any;
  }>;
}

export default class DemoOnly extends Component<{}, any> {
  state = {
    isLoading: false,
    dataSource: [],
  };

  handleSearch = (keyword: string) => {
    console.log(keyword);
    this.setState({ isLoading: true });
    fetch("https://randomuser.me/api/?results=5")
      .then(resp => resp.json())
      .then(({ results = [] }: R) => {
        this.setState({ isLoading: false });
        console.log(results);
        const dataSource = results.map(({ name = {}, picture = {}, }) => {
          const { first, last } = name;
          const { thumbnail } = picture;
          return {
            label: (
              <span style={{ display: "flex", alignItems: "center" }}>
                <img src={thumbnail} alt="avatar" width="20" height="20" />{" "}
                { `${first} ${last}` }
              </span>
            ),
            value: `${first} ${last}`,
          };
        });
        console.log(dataSource);
        this.setState({ dataSource });
      });
  }

  render() {
    const {
      isLoading,
      dataSource,
    } = this.state;

    return (
      <div style={{ width: 300, margin: "25% auto" }}>
        <RMultiSelect
          isLoading={isLoading}
          dataSource={dataSource}
          onSearch={this.handleSearch}
        />
      </div>
    );
  }
}
