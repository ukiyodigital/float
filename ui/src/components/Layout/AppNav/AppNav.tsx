import * as React from "react";

import * as logo from "../../../assets/images/float-logo.png";
import "./AppNav.less";

const AppNav = () => (
    <React.Fragment>
        <img src={logo} alt="float logo" className="float-logo" />
    </React.Fragment>
);

export default AppNav;
