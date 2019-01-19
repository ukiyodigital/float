import * as React from "react";
import {render} from "react-dom";
import {hot} from "react-hot-loader";

import {Provider} from "mobx-react";
import DevTools from "mobx-react-devtools";

import createBrowserHistory from "history/createBrowserHistory";
import {syncHistoryWithStore} from "mobx-react-router";
import {Router} from "react-router";

import dataLoaderMiddleware from "../routing/data-loader-middleware";
import appStore from "../stores";

import Layout from "./Layout/Layout";

import "../assets/styles/main.less";

// router
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, appStore.routerStore)

// app container
const appContainer = document.getElementById("app");
if (appContainer === null) {
    throw new Error("app container id 'app' is not defined.");
}

// app component
const App = () => (
    <Provider appStore={appStore} routerStore={appStore.routerStore}>
        <Router history={history}>
            <React.Fragment>
                <Layout />
                {process.env.APP_ENV === "development" ? (
                    <DevTools position={{ bottom: 0, left: 0 }} />
                ) : null}
            </React.Fragment>
        </Router>
    </Provider>
);

const HotApp = hot(module)(App);

// renderer
const renderApp = () => {
    render(<HotApp />, appContainer);
};

export {
    renderApp
};
