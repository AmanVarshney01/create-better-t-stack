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

        // `async (a, ...[b]) => body` becomes
        // `(...args) => (async ([a, ...[b]]) => body)(args)`.
        // The sync wrapper only collects arguments. The async arrow keeps them in
        // a parameter, so defaults still resolve in the parameter scope and a
        // failure while binding them rejects the returned promise.
        const args = path.scope.generateUidIdentifier("args");
        const inner = t.arrowFunctionExpression([t.arrayPattern(node.params)], node.body, true);

        node.async = false;
        node.params = [t.restElement(t.cloneNode(args))];
        node.body = t.callExpression(inner, [t.cloneNode(args)]);
      },
    },
  };
};
