import React from "react";
import { render } from "react-dom";
import { Layout, Breadcrumb, Icon } from "antd";

import "./index.less";

import { RMenu } from "./../components";

const { Header, Sider, Content } = Layout;

// import App from "./_demo/r-multi-select";
// import App from "./_demo/r-form";
// import App from "./_demo/r-menu/app";

class App extends React.Component<{}, any> {
  state = {
    current: "",
    content: null,
  };

  componentDidMount() {
    const { current } = this.state;
    const searchParams = new URLSearchParams(location.search);
    const c = searchParams.get("comp") || current;
    this.setState({ current: c });
    this.renderContent(c);
  }

  renderContent = (current?: string) => {
    if (!current) {
      const searchParams = new URLSearchParams(location.search);
      current = searchParams.get("comp") || "r-form";
    }
    const DemoOnly = require(`./_demo/${current}`).default;
    this.setState({ current, content: <DemoOnly /> });
  };

  handleSiderMenuClick = ({ key }) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("comp", key);
    window.history.replaceState({}, "", `${location.pathname}?${searchParams}`);
    this.renderContent();
  };

  render() {
    const { current } = this.state;

    return (
      <Layout>
        <Header className="header">
          <div className="logo">R-Antd</div>
          <RMenu
            // theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["doc"]}
            style={{ lineHeight: "64px" }}
            dataSource={[
              {
                type: "menuitem",
                key: "doc",
                children: "Documentation",
              },
            ]}
          />
        </Header>
        <Layout>
          <Sider className="sider">
            <RMenu
              theme="dark"
              mode="inline"
              selectedKeys={[current]}
              defaultOpenKeys={["comp"]}
              style={{ height: "100%", borderRight: 0 }}
              onClick={this.handleSiderMenuClick}
              dataSource={[
                {
                  type: "submenu",
                  key: "comp",
                  title: (
                    <span>
                      <Icon type="appstore-o" />Component
                    </span>
                  ),
                  children: [
                    {
                      type: "menuitem",
                      key: "r-form",
                      children: "RForm",
                    },
                    {
                      type: "menuitem",
                      key: "r-menu",
                      children: "RMenu",
                    },
                    {
                      type: "menuitem",
                      key: "r-multi-select",
                      children: "RMultiSelect",
                    },
                    {
                      type: "menuitem",
                      key: "r-select",
                      children: "RSelect",
                    },
                    {
                      type: "menuitem",
                      key: "r-table",
                      children: "RTable",
                    },
                    {
                      type: "menuitem",
                      key: "r-table-transfer",
                      children: "RTableTransfer",
                    },
                  ] as any,
                },
              ]}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "12px 0" }}>
              <Breadcrumb.Item>Documentation</Breadcrumb.Item>
              <Breadcrumb.Item>Component</Breadcrumb.Item>
              <Breadcrumb.Item>{current}</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="content">{this.state.content}</Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

render(<App />, document.querySelector("#react-root"));
