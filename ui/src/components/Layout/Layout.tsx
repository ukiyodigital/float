import * as React from "react";

import {inject} from "mobx-react";

import {Layout, Menu} from "antd";

import AppNav from "./AppNav/AppNav";
import AppSidebar from "./AppSidebar/AppSidebar";
import ExternalNav from "./ExternalNav/ExternalNav";

import RouteNode from "../RouteNode/RouteNode";

import IAppStore from "../../types/stores";

import "./Layout.less";

interface IAppStoreProps {
    appStore?: IAppStore;
}

const AppLayout = ({appStore}: IAppStoreProps) => {
    const {Content, Sider, Header, Footer} = Layout;
    const isExternal: boolean = appStore.routerStore.location.pathname === "/login";
    const Navigation = () => {
        if (isExternal) {
            // website branding
            return (
                <ExternalNav />
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
