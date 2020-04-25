const webpack = require('webpack');
const config = require('../webpack.config');


webpack(config).run((error) => {
  if (error) {
    console.log(error);
    return 1;
  }

  console.log('webpack compiled successfully.');

  return 0;
});
