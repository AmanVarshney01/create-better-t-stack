// Hermes 260318099.0.4 (react-native 0.88) cannot compile async arrow functions
// with a rest parameter, such as `async (...[input, options = {}]) => {}` in
// @orpc/client. babel-preset-expo 58.0.18 dropped the transform that rewrote them.
// Remove this plugin once Hermes compiles the syntax again:
// https://github.com/expo/expo/issues/51842
module.exports = function hermesAsyncArrowRestParams({ types: t }) {
  return {
    name: "hermes-async-arrow-rest-params",
    visitor: {
      ArrowFunctionExpression(path) {
        const { node } = path;
        if (!node.async || !node.params.some((param) => t.isRestElement(param))) {
          return;
        }

        // A sync arrow keeps the parameters and returns the result of an
        // async arrow that closes over them, so callers still get a promise.
        const body = t.isBlockStatement(node.body)
          ? node.body
          : t.blockStatement([t.returnStatement(node.body)]);
        node.async = false;
        node.body = t.callExpression(t.arrowFunctionExpression([], body, true), []);
      },
    },
  };
};
