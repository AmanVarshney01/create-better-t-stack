import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import qwikCityPlan from "@qwik-city-plan";

import render from "./entry.ssr";

const { router, notFound } = createQwikCity({ render, qwikCityPlan });

export { notFound, router };
