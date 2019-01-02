// @flow
import {RouterStore as MRRouterStore} from "mobx-router5";


class RouterStore extends MRRouterStore {
    appStore: AppStore;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
    }
}

export default RouterStore;
