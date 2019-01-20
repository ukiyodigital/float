import * as React from "react";

import {Menu} from "antd";

import {Link} from "react-router-dom";

export default () => (
    <Menu mode="horizontal" theme="dark">
        <Menu.Item key="home">
            <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="about">About</Menu.Item>
        <Menu.Item key="login">Login</Menu.Item>
    </Menu>
);
