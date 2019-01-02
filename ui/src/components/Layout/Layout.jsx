// @flow
import * as React from "react";
import { inject } from "mobx-react";

import { Container } from "semantic-ui-react";

import Footer from "./Footer";
import AppNav from "./AppNav/AppNav";
import TopNav from "./TopNav";
import AppSidebar from "./AppSidebar/AppSidebar";
import MainNode from "../RouteNode/MainNode";

import "./Layout.less";

type Props = {
    appStore: AppStore
};

const Layout = ({appStore}: Props) => {
    const Navigation = () => {
        if (appStore.routerStore.route.name === "login") {
            // website branding
            return (
                <div>
                    <TopNav />
                </div>
            );
        }
        // webapp branding
        return (
            <AppNav />
        );
    };

    return (
        <div className="float-layout">
            <AppSidebar />
            <Navigation />
            <Container>
                <MainNode />
            </Container>
            <Footer />
        </div>
    );
};

export default inject("appStore")(Layout);
