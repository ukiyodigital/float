import * as React from "react";

import {Icon, Menu} from "antd";

import "./AppSidebar.less";

const AppSidebar = () => (
    <div>
        <Menu
            mode="inline"
            theme="dark"
        >
            <Menu.Item>
                <Icon type="pie-chart" />
                <span>Option 1</span>
            </Menu.Item>
        </Menu>
    </div>
);

export default AppSidebar;
