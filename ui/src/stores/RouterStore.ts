import {RouterStore as MRRouterStore} from "mobx-react-router";

import IAppStore from "../types/stores";

class RouterStore extends MRRouterStore {
    public appStore: IAppStore;

    constructor(appStore: IAppStore) {
        super();
        this.appStore = appStore;
    }
}

export default RouterStore;
