import * as React from "react";
import {Route} from "react-router-dom";
import routes from "../../routing/routes";


const routeNodeName = ""; // root node

type route = {
    path: string,
    exact?: boolean,
    component: any,
    name: string
}

const RouteNode = () => (
    <React.Fragment>
        {routes.map((route: route) => <Route path={route.path} exact={route.exact} component={route.component} name={route.name} />)}
    </React.Fragment>
);

export default RouteNode;
