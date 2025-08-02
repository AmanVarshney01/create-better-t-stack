"use client";
import { create } from "@orama/orama";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogOverlay,
	type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { customSearchItems, filterCustomItems } from "@/lib/search-config";

function initOrama() {
	return create({
		schema: {
			_: "string",
		},
		language: "english",
	});
}

export default function DefaultSearchDialog(props: SharedProps) {
	const { search, setSearch, query } = useDocsSearch({
		type: "static",
		initOrama,
	});

	const filteredCustomItems = filterCustomItems(
		customSearchItems,
		search || "",
	);

	const combinedResults =
		query.data === "empty" || !query.data
			? null
			: [
					...query.data,
					...filteredCustomItems.map((item, index) => ({
						id: `custom-${index}`,
						title: item.title,
						url: item.url,
						content: item.content,
						type: "page" as const,
					})),
				];

	return (
		<SearchDialog
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...props}
		>
			<SearchDialogOverlay />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList items={combinedResults} />
			</SearchDialogContent>
		</SearchDialog>
	);
}
