import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { z } from "zod";
import { BetterTStackConfigFileSchema } from "@better-t-stack/types";

const schema = z.toJSONSchema(BetterTStackConfigFileSchema, { target: "draft-7" });
const tempPath = join(tmpdir(), "bts-schema.json");

writeFileSync(tempPath, JSON.stringify(schema, null, 2));
execSync(`npx wrangler r2 object put "bucket/schema.json" --file="${tempPath}" --remote`, {
  stdio: "inherit",
});

console.log("Uploaded schema.json to R2");
