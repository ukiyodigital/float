import router5 from "router5";
import browser from "router5/plugins/browser";
import listeners from "router5/plugins/listeners";
import logger from "router5/plugins/logger";

import {mobxPlugin} from "mobx-router5";

import routes from "./routes";
import scrollTopPlugin from "./scroll-top-plugin";

export default (appStore, useLogger) => {
    const options = {
        defaultRoute: "home",
        queryParamsMode: "loose",
    } as Partial<any>;

    const router = router5(routes, options)
        .usePlugin(browser({useHash: false, preserveHash: false}))
        .usePlugin(mobxPlugin(appStore.routerStore))
        .usePlugin(listeners())
        .usePlugin(scrollTopPlugin);

    if (useLogger) {
        router.usePlugin(logger);
    }

    return router;
};
