import { httpRouter } from "convex/server";
import { ossStats } from "./stats";

const http = httpRouter();

ossStats.registerRoutes(http);
export default http;
