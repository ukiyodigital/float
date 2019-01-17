import RouterStore from "./RouterStore";

import IAppStore from "../types/stores";

class AppStore implements IAppStore {
    public routerStore: RouterStore;

    constructor() {
        this.routerStore = new RouterStore(this);
    }
}

export default AppStore;
