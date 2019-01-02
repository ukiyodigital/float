// @flow
import * as React from "react";
import { routeNode, RouteView } from "react-mobx-router5";
import { Container } from "semantic-ui-react";
import routes from "../../routing/routes";


const routeNodeName = ""; // root node

type Props = {
    route: Object
};

const RouteNode = ({ route }: Props) => (
    <Container fluid className="main-container">
        <RouteView route={route} routes={routes} routeNodeName={routeNodeName} />
    </Container>
);

export default routeNode(routeNodeName)(RouteNode);
