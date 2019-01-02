/* eslint-disable no-console */
import webpack from "webpack";
import config from "../webpack.config";


webpack(config).run((error) => {
    if (error) {
        console.log(error);
        return 1;
    }

    console.log("webpack compiled successfully.");

    return 0;
});
