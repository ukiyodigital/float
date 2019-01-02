// @flow
export default {
    dashboard: {
        loginRequired: false,
        loader({done, loadData}: DataLoaderArgs) {
            loadData().then(() => {
                done();
            }).catch(() => {

            });
        }
    }
};
