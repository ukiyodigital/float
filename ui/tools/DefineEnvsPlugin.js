// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');


class DefineEnvsPlugin {
  /**
   * @description - takes array of keys, stringify each of the proccess.env.key values,
   * then define the global constants using webpack.
   *
   * @param {String[]} keys - keys to be defined from process.envs scope
   * @param {String} scope - scope of the global constants. Defaults to proceess.env
   */

  constructor(keys, scope = 'process.env') {
    if (!Array.isArray(keys)) {
      throw new Error("'keys' parameter must be an array.");
    }
    this.keys = keys;
    this.scope = scope;
  }

  apply(compiler) {
    const definitions = {
      [this.scope]: this.keys.reduce((acc, cur) => {
        const value = process.env[cur];
        acc[cur] = value === undefined ? 'undefined' : JSON.stringify(value);

        return acc;
      }, {}),
    };

    new webpack.DefinePlugin(definitions).apply(compiler);
  }
}

module.exports = DefineEnvsPlugin;
