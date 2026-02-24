const CHECKABLE_EXTENSIONS = /\.(?:[cm]?[jt]sx?|json|ya?ml|md|css|scss)$/i;

const IGNORED_PREFIXES = ["apps/cli/test/"];

export default {
  "*": (files) => {
    const shouldRunCheck = files.some(
      (file) =>
        CHECKABLE_EXTENSIONS.test(file) &&
        !IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix)),
    );

    return shouldRunCheck ? ["bun check"] : [];
  },
};
