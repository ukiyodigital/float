const scrollTopPlugin = () => ({
    onTransitionSuccess: () => {
        window.scrollTo(0, 0);
    },
});

scrollTopPlugin.pluginName = "SCROLL_TOP";

export default scrollTopPlugin;
