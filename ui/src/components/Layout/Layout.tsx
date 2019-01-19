import * as React from "react";

import { inject } from "mobx-react";

import { Layout } from "antd";

import AppNav from "./AppNav/AppNav";
import AppSidebar from "./AppSidebar/AppSidebar";

import RouteNode from "../RouteNode/MainNode";

import "./Layout.less";

// type Props = {
//     appStore: AppStore
// };

const AppLayout = () => {
    const { Content, Sider, Header, Footer } = Layout;
    // const Navigation = () => {
    //     if (appStore.routerStore.route.name === "login") {
    //         // website branding
    //         return (
    //             <div>
    //                 {/* <TopNav /> */}
    //             </div>
    //         );
    //     }
    //     // webapp branding
    //     return (
    //         // <AppNav />
    //         <div />
    //     );
    // };

    return (
        <Layout className="float-layout">
            <Sider>
                <AppSidebar />
            </Sider>
            <Layout>
                <Header>
                    <AppNav />
                </Header>
                <Content>
                    <RouteNode />
                </Content>
                <Footer className="float-footer" />
            </Layout>
        </Layout>
    );
};

export default inject("appStore")(AppLayout);
