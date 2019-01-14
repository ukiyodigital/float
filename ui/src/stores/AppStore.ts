import RouterStore from "./RouterStore";


class AppStore {
    routerStore: RouterStore;

    constructor() {
        this.routerStore = new RouterStore(this);
    }
}

export default AppStore;
