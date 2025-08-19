import { useQueries } from "convex/react";
import { makeUseQueryWithStatus } from "convex-helpers/react";

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);
