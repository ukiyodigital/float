// @flow
import dataLoaders from "../data-loaders";
import api from "../api";


const loadData = (promises?: Array<Promise<any>>) => {
    const preloadPromises = [];

    return Promise.all(preloadPromises.concat(promises))
        .then((responses: Array<any>) => {
            if (preloadPromises.length > 0) {
                // TODO: process preload data
            }
            return responses.slice(preloadPromises.length);
        });
};

export default () => (toState: Object, fromState: Object, done: Function) => {
    const dls: Array<any> = Object.values(dataLoaders);
    for (let i = 0; i < dls.length; i += 1) {
        const dl: Object = dls[i];
        if (Object.prototype.hasOwnProperty.call(dl, toState.name)) {
            const dlState: DataLoader = dl[toState.name];

            if (dlState.loginRequired) {
                api.user.auth()
                    .then(() => {
                        dlState.loader({toState, fromState, done, loadData});
                    })
                    .catch(() => {
                        done({redirect: {name: "login", params: {returnurl: window.location.href}}});
                    });
            }
            else {
                dlState.loader({toState, fromState, done, loadData});
            }
            break;
        }
    }
};
