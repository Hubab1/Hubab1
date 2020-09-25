module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "jest": true,
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "extends": "react-app",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
    },
    "rules" : {
        //"eol-last": [1],
        //"jsx-quotes": ["error", "prefer-double"],
        //"no-console": ["error", { "allow": ["warn", "error"] }],
        //"no-debugger": ["error"],
        //"no-multiple-empty-lines": ["error", {"max": 2}],
        //"no-shadow": ["error"],
        //"no-trailing-spaces": ["error", { "skipBlankLines": true }],
        //"no-unused-vars": ["error", { "vars": "all", "args": "after-used" }],
        "prefer-const": ["error"],
        "quotes": [2, "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
        "react/display-name": 0,
        "react/jsx-closing-bracket-location": 2,
        "react/no-danger": 0,
        //"react/prop-types": [2, {"ignore": ["className"]}],
        "react/no-deprecated": 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "react/no-string-refs": ["error"],
        "react/no-find-dom-node": ["error"],
        "react/no-unescaped-entities": ["error"],
        "semi": ["error", "always"]
    }
};