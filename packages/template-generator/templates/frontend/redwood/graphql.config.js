const { getPaths } = require("@redwoodjs/project-config");

const redwoodPaths = getPaths();

module.exports = {
  schema: redwoodPaths.generated.schema,
  documents: "./web/src/**/!(*.d).{ts,tsx,js,jsx}",
};
