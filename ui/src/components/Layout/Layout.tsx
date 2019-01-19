import * as React from "react";

import {inject} from "mobx-react";

import {Layout, Menu} from "antd";

import AppNav from "./AppNav/AppNav";
import AppSidebar from "./AppSidebar/AppSidebar";

import RouteNode from "../RouteNode/RouteNode";

import IAppStore from "../../types/stores";

import "./Layout.less";

type appStoreProps = {
    appStore?: IAppStore
}

const AppLayout = ({appStore}: appStoreProps) => {
    console.log(appStore.routerStore.location);
    const { Content, Sider, Header, Footer } = Layout;
    const isExternal: boolean = appStore.routerStore.location.pathname === "/login"
    const Navigation = () => {
        if (isExternal) {
            // website branding
            return (
                <Menu mode="horizontal" theme="dark">
                    <Menu.Item key="home">Home</Menu.Item>
                    <Menu.Item key="about">About</Menu.Item>
                    <Menu.Item key="login">Login</Menu.Item>
                </Menu>
            );
        }
        // webapp branding
        return (
            <React.Fragment>
                <Header>
                    <AppNav />
                </Header>
            </React.Fragment>
        );
    };

    return (
        <Layout className="float-layout">
            {!isExternal ? (
                <Sider>
                    <AppSidebar />
                </Sider>
            ) : null}
            <Layout>
                <Navigation />
                <Content>
                    <RouteNode />
                </Content>
                <Footer className="float-footer" />
            </Layout>
        </Layout>
    );
};

export default inject("appStore")(AppLayout);
