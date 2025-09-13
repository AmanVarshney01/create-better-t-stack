"use client";

import { useEffect, useState } from "react";

const NpmPackage = () => {
	const [version, setVersion] = useState("0.0.0");

	useEffect(() => {
		const getLatestVersion = async () => {
			try {
				const res = await fetch(
					"https://api.github.com/repos/AmanVarshney01/create-better-t-stack/releases",
				);
				if (!res.ok) throw new Error("Failed to fetch version");
				const data = await res.json();
				const latestVersion = data[0].tag_name.replace(/^v/, "");
				setVersion(latestVersion);
			} catch (error) {
				console.error("Error fetching NPM version:", error);
				setVersion("latest");
			}
		};
		getLatestVersion();
	}, []);

	return (
		<div className="mt-2 flex items-center justify-center">
			<span className="mr-2 inline-block h-5 w-3 bg-primary" />
			<span className="text-muted-foreground text-xl">[v{version}]</span>
		</div>
	);
};

export default NpmPackage;