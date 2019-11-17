module.exports = {
  "parserOptions": {
    "ecmaVersion": 9
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "jquery": true
  },
  "extends": "airbnb-base",
  "plugins": [ "import", "html" ],
  "rules": {
    "vars-on-top" : 0,
    "func-names" : 0,
    "prefer-arrow-callback" : 0,
    "no-use-before-define" : 0,
    // "no-console" : 0,
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    "no-console": 0,
    "quotes": [ "error", "single" ],
    "no-underscore-dangle": "warn",
    "no-plusplus": [ "error", { "allowForLoopAfterthoughts": true }],
    //"no-plusplus": [ "0", { "allowForLoopAfterthoughts": true }],
    "comma-dangle": [ "error", "never"]
  }
};