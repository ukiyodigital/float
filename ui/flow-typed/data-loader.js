/* eslint-disable */


// data loader middleware
declare type DataLoader = {
    loginRequired: boolean,
    loader: Function
}

declare type DataLoaderArgs = {
    toState: Object,
    fromState: Object | null,
    done: Function,
    loadData: Function
}
