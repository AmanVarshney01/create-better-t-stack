import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { CreateJSStackConfigFileSchema } from "@create-js-stack/types";
import { z } from "zod";

const schema = z.toJSONSchema(CreateJSStackConfigFileSchema, { target: "draft-7" });
const tempPath = join(tmpdir(), "cjs-schema.json");

writeFileSync(tempPath, JSON.stringify(schema, null, 2));
execSync(`npx wrangler r2 object put "bucket/schema.json" --file="${tempPath}" --remote`, {
  stdio: "inherit",
});

console.log("Uploaded schema.json to R2");
