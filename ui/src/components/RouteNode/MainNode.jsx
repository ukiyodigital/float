// @flow
import * as React from "react";
import { routeNode, RouteView } from "react-mobx-router5";
import routes from "../../routing/routes";


const routeNodeName = ""; // root node

type Props = {
    route: Object
};

const RouteNode = ({ route }: Props) => (
    <RouteView route={route} routes={routes} routeNodeName={routeNodeName} />
);

export default routeNode(routeNodeName)(RouteNode);
