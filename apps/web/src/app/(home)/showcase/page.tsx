import { api } from "@better-t-stack/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import ShowcasePage from "./_components/showcase-page";

export default async function Showcase() {
	const preloadedShowcase = await preloadQuery(
		api.showcase.getShowcaseProjects,
	);
	return <ShowcasePage preloadedShowcase={preloadedShowcase} />;
}
