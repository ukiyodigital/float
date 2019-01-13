import {RouterStore as MRRouterStore} from "mobx-router5";

class RouterStore extends MRRouterStore {
    appStore: any;

    constructor(appStore) {
        super();
        this.appStore = appStore;
    }
}

export default RouterStore;
