import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Authentication endpoints
auth.addHttpRoutes(http);

export default http;
