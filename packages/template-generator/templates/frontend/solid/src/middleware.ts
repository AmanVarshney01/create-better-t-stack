import type { StartMiddleware } from "@solidjs/vite-plugin";
import { createAPIHandler } from "filesystem-routing/api";
import routes from "virtual:file-routes";

const handleAPI = createAPIHandler(routes);

export default ((event, next) => handleAPI(event.request, next)) satisfies StartMiddleware;
