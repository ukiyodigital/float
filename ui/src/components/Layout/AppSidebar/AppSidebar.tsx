import * as React from "react";

import {Icon, Menu} from "antd";
import {Link} from "react-router-dom";

import "./AppSidebar.less";

const AppSidebar = () => (
    <div>
        <Menu
            mode="inline"
            theme="dark"
        >
            <Menu.Item>
                <Link to="/login">
                    <Icon type="pie-chart" />
                    Login
                </Link>
            </Menu.Item>
        </Menu>
    </div>
);

export default AppSidebar;
