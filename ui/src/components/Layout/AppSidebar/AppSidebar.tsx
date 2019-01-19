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
                <Icon type="pie-chart" />
                <Link to="/login"><span>Option 1</span></Link>
            </Menu.Item>
        </Menu>
    </div>
);

export default AppSidebar;
