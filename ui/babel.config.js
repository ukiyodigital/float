const plugins = [
  '@babel/plugin-syntax-dynamic-import',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }],
];

const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3,
    include: [
      '@babel/plugin-proposal-object-rest-spread',
    ],
  }],
  '@babel/preset-react',
];

module.exports = {
  plugins,
  presets,
};
