import ossStats from "@erquhart/convex-oss-stats/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(ossStats);

export default app;
