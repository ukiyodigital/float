import * as React from "react";
import { render } from "react-dom";
import { hot } from "react-hot-loader";

import { Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";

import createRouter from "../routing/create-router";
import dataLoaderMiddleware from "../routing/data-loader-middleware";
import appStore from "../stores";

import Layout from "./Layout/Layout";

import "../assets/styles/main.less";

// router
const router = createRouter(appStore, process.env.APP_ENV === "development");
router.useMiddleware(dataLoaderMiddleware);

// app container
const appContainer = document.getElementById("app");
if (appContainer === null) {
    throw new Error("app container id 'app' is not defined.");
}

// app component
const App = () => (
    <Provider appStore={appStore} routerStore={appStore.routerStore}>
        <React.Fragment>
            <Layout />
            {process.env.APP_ENV === "development" ? (
                <DevTools position={{ bottom: 0, left: 0 }} />
            ) : null}
        </React.Fragment>
    </Provider>
);

const HotApp = hot(module)(App);

// renderer
const renderApp = () => {
    render(<HotApp />, appContainer);
};

export {
    renderApp,
    router,
};
