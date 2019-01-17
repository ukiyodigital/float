import {RouterStore as MRRouterStore} from "mobx-router5";

import IAppStore from "../types/stores";

class RouterStore extends MRRouterStore {
    public appStore: IAppStore;

    constructor(appStore: IAppStore) {
        super();
        this.appStore = appStore;
    }
}

export default RouterStore;
