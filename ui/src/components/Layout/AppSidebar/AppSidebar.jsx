// @flow
import * as React from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import "./AppSidebar.less";

const AppSidebar = () => (
    <Sidebar className="float-sidebar" as={Menu} icon="labeled" inverted vertical visible>
        <Menu.Item as="a">
            Home
        </Menu.Item>
        <Menu.Item as="a">
            Games
        </Menu.Item>
        <Menu.Item as="a">
            Channels
        </Menu.Item>
    </Sidebar>
);

export default AppSidebar;
