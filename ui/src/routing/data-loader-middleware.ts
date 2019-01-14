import dataLoaders from "../data-loaders";
import api from "../api";


const loadData = (promises) => {
    const preloadPromises = [];

    return Promise.all(preloadPromises.concat(promises))
        .then((responses) => {
            if (preloadPromises.length > 0) {
                // TODO: process preload data
            }
            return responses.slice(preloadPromises.length);
        });
};

export default () => (toState, fromState, done) => {
    const dls = Object.values(dataLoaders);
    for (let i = 0; i < dls.length; i += 1) {
        const dl = dls[i];
        if (Object.prototype.hasOwnProperty.call(dl, toState.name)) {
            const dlState = dl[toState.name];

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
