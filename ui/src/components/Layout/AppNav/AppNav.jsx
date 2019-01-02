// @flow
import * as React from "react";
// import { Link } from "react-mobx-router5";
import { Menu, Image } from "semantic-ui-react";

import floatLogo from "../../../assets/images/float-logo.png";
import "./AppNav.less";

const AppNav = () => (
    <Menu borderless className="float-top-nav-app">
        <Menu.Header className="item">
            <Image src={floatLogo} centered size="small" />
        </Menu.Header>
    </Menu>
);

export default AppNav;
