module.exports = {
    root: true,
    parser: "babel-eslint",
    env: {
        browser: true,
    },
    plugins: [
        "jest"
    ],
    extends: [
      "airbnb",
      "airbnb/hooks",
    ],
  };
