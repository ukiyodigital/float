import * as React from "react";
import {Route} from "react-router-dom";
import routes from "../../routing/routes";

export interface IRoute {
    path: string;
    exact?: boolean;
    component: any;
    name: string;
}

const RouteNode = () => (
    <React.Fragment>
        {routes.map(
            (route: IRoute) =>
                (
                    <Route
                        key={route.name}
                        path={route.path}
                        exact={route.exact}
                        component={route.component}
                        name={route.name}
                    />
                ),
        )}
    </React.Fragment>
);

export default RouteNode;
