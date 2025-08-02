export interface CustomSearchItem {
	title: string;
	url: string;
	content: string;
	tags: string[];
}

export const customSearchItems: CustomSearchItem[] = [
	{
		title: "Analytics",
		url: "/analytics",
		content: "Analytics",
		tags: ["analytics", "insights", "statistics", "data", "metrics"],
	},
	{
		title: "Showcase",
		url: "/showcase",
		content: "Showcase",
		tags: ["showcase", "projects", "examples", "demos", "portfolio"],
	},
	{
		title: "Builder",
		url: "/new",
		content: "Builder",
		tags: ["builder", "create", "new", "project", "setup"],
	},
	{
		title: "GitHub Repository",
		url: "https://github.com/AmanVarshney01/create-better-t-stack",
		content: "GitHub",
		tags: ["github", "source", "code", "repository", "contribute", "star"],
	},
	{
		title: "NPM Package",
		url: "https://www.npmjs.com/package/create-better-t-stack",
		content: "NPM",
		tags: ["npm", "package", "install", "cli", "tool"],
	},
	{
		title: "X (Twitter)",
		url: "https://x.com/amanvarshney01",
		content: "X",
		tags: ["twitter", "x", "social", "updates", "announcements", "follow"],
	},
	{
		title: "Discord Community",
		url: "https://discord.gg/ZYsbjpDaM5",
		content: "Discord",
		tags: ["discord", "community", "chat", "help", "support", "discussions"],
	},
];

export function filterCustomItems(
	items: CustomSearchItem[],
	searchQuery: string,
): CustomSearchItem[] {
	if (!searchQuery) return items;

	const searchLower = searchQuery.toLowerCase();
	return items.filter(
		(item) =>
			item.title.toLowerCase().includes(searchLower) ||
			item.content.toLowerCase().includes(searchLower) ||
			item.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
	);
}
