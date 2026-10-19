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
        // `(...args) => (async () => { let [a, ...[b]] = args; body })()`.
        // The sync wrapper only collects arguments, so a failure while binding
        // them still rejects the returned promise instead of throwing.
        const args = path.scope.generateUidIdentifier("args");
        const binding = t.variableDeclaration("let", [
          t.variableDeclarator(t.arrayPattern(node.params), args),
        ]);
        const body = t.isBlockStatement(node.body)
          ? t.blockStatement([binding, ...node.body.body], node.body.directives)
          : t.blockStatement([binding, t.returnStatement(node.body)]);

        node.async = false;
        node.params = [t.restElement(t.cloneNode(args))];
        node.body = t.callExpression(t.arrowFunctionExpression([], body, true), []);
      },
    },
  };
};
