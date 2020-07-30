module.exports = {
  parser: "babel-eslint",
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:jest/recommended",
  ],
  plugins: [
    "babel",
    "jest",
  ],
  env: {
    browser: true,
  },
  rules: {
    "camelcase": ["off"],
    "babel/camelcase": ["error"],
    "react/jsx-props-no-spreading": [2, {
      exceptions: ["Controller"],
    }],
    "react/forbid-prop-types": ["off"],
  },
  settings: {
    "import/resolver": ["node", "webpack"],
  },
  globals: {
    ENVS: "readonly",
  }
};
