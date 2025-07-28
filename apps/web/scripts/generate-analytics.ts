import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Papa from "papaparse";

// TODO: write a more effiecient way of handling analytics

interface AnalyticsData {
	date: string;
	hour: number;
	cli_version: string;
	node_version: string;
	platform: string;
	backend: string;
	database: string;
	orm: string;
	dbSetup: string;
	auth: string;
	api: string;
	packageManager: string;
	frontend0: string;
	frontend1: string;
	examples0: string;
	examples1: string;
	addons: string[];
	git: string;
	install: string;
	runtime: string;
}

interface CSVRow {
	[key: string]: string;
}

interface ProcessedAnalyticsData {
	data: AnalyticsData[];
	lastUpdated: string | null;
	generatedAt: string;
	totalRecords: number;
}

async function generateAnalyticsData() {
	try {
		console.log("🔄 Fetching analytics data...");

		const response = await fetch("https://r2.amanv.dev/export.csv");
		const csvText = await response.text();

		console.log("📊 Processing CSV data...");

		let processedData: AnalyticsData[] = [];

		Papa.parse<CSVRow>(csvText, {
			header: true,
			complete: (results) => {
				try {
					processedData = results.data
						.map((row): AnalyticsData | null => {
							const timestamp = row["*.timestamp"] || new Date().toISOString();
							const date = timestamp.includes("T")
								? timestamp.split("T")[0]
								: timestamp.split(" ")[0];

							let hour = 0;
							try {
								const timestampDate = new Date(timestamp);
								if (!Number.isNaN(timestampDate.getTime())) {
									hour = timestampDate.getUTCHours();
								}
							} catch {
								hour = 0;
							}

							const addons = [
								row["*.properties.addons.0"],
								row["*.properties.addons.1"],
								row["*.properties.addons.2"],
								row["*.properties.addons.3"],
								row["*.properties.addons.4"],
								row["*.properties.addons.5"],
							].filter(Boolean);

							return {
								date,
								hour,
								cli_version: row["*.properties.cli_version"] || "unknown",
								node_version: row["*.properties.node_version"] || "unknown",
								platform: row["*.properties.platform"] || "unknown",
								backend: row["*.properties.backend"] || "none",
								database: row["*.properties.database"] || "none",
								orm: row["*.properties.orm"] || "none",
								dbSetup: row["*.properties.dbSetup"] || "none",
								auth:
									row["*.properties.auth"] === "True" ? "enabled" : "disabled",
								api: row["*.properties.api"] || "none",
								packageManager: row["*.properties.packageManager"] || "unknown",
								frontend0: row["*.properties.frontend.0"] || "",
								frontend1: row["*.properties.frontend.1"] || "",
								examples0: row["*.properties.examples.0"] || "",
								examples1: row["*.properties.examples.1"] || "",
								addons,
								git:
									row["*.properties.git"] === "True" ? "enabled" : "disabled",
								install:
									row["*.properties.install"] === "True"
										? "enabled"
										: "disabled",
								runtime: row["*.properties.runtime"] || "unknown",
							};
						})
						.filter((item): item is AnalyticsData =>
							Boolean(item?.date && item?.platform !== "unknown"),
						);
				} catch (error) {
					console.error("Error parsing CSV:", error);
				}
			},
			error: (error: unknown) => {
				console.error("Papa Parse error:", error);
			},
		});

		const lines = csvText.split("\n");
		const timestampColumn = lines[0]
			.split(",")
			.findIndex((header) => header.includes("timestamp"));

		let lastUpdated: string | null = null;
		if (timestampColumn !== -1) {
			const timestamps = lines
				.slice(1)
				.filter((line) => line.trim())
				.map((line) => {
					const columns = line.split(",");
					return columns[timestampColumn]?.replace(/"/g, "");
				})
				.filter(Boolean)
				.map((timestamp) => new Date(timestamp))
				.filter((date) => !Number.isNaN(date.getTime()));

			if (timestamps.length > 0) {
				const mostRecentDate = new Date(
					Math.max(...timestamps.map((d) => d.getTime())),
				);
				lastUpdated = mostRecentDate.toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					timeZone: "UTC",
				});
			}
		}

		const analyticsData: ProcessedAnalyticsData = {
			data: processedData,
			lastUpdated,
			generatedAt: new Date().toISOString(),
			totalRecords: processedData.length,
		};

		console.log("📤 Uploading to Cloudflare R2...");

		const tempDir = mkdtempSync(join(tmpdir(), "analytics-"));
		const tempFilePath = join(tempDir, "analytics-data.json");

		writeFileSync(tempFilePath, JSON.stringify(analyticsData, null, 2));

		const BUCKET_NAME = "bucket";
		const key = "analytics-data.json";
		const cmd = `npx wrangler r2 object put "${BUCKET_NAME}/${key}" --file="${tempFilePath}" --remote`;

		console.log(`Uploading ${tempFilePath} to r2://${BUCKET_NAME}/${key} ...`);
		try {
			execSync(cmd, { stdio: "inherit" });
		} catch (err) {
			console.error("Failed to upload analytics data:", err);
			throw err;
		}

		console.log(
			`✅ Generated analytics data with ${processedData.length} records`,
		);
		console.log("📤 Uploaded to R2 bucket: bucket/analytics-data.json");
		console.log(`🕒 Last data update: ${lastUpdated}`);
	} catch (error) {
		console.error("❌ Error generating analytics data:", error);
		process.exit(1);
	}
}

if (process.argv[1]?.endsWith("generate-analytics.ts")) {
	await generateAnalyticsData();
}

export { generateAnalyticsData };
