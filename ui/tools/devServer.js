const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

const compiler = webpack(config);
const options = {
  historyApiFallback: true,
  disableHostCheck: true,
  hot: true,
  contentBase: path.join(__dirname, 'dist'),
  clientLogLevel: 'error',
};
const server = new WebpackDevServer(compiler, options);

server.listen(3000);
