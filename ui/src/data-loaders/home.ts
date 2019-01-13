export default {
    dashboard: {
        loginRequired: false,
        loader({done, loadData}) {
            loadData().then(() => {
                done();
            }).catch(() => {

            });
        }
    }
};
