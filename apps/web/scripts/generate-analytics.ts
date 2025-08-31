import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Papa from "papaparse";

interface CSVRow {
	[key: string]: string;
}

interface AggregatedAnalyticsData {
	lastUpdated: string | null;
	generatedAt: string;
	totalRecords: number;
	timeSeries: Array<{ date: string; displayDate: string; count: number }>;
	monthlyTimeSeries: Array<{
		month: string;
		displayMonth: string;
		count: number;
	}>;
	platformDistribution: Array<{ name: string; value: number }>;
	packageManagerDistribution: Array<{ name: string; value: number }>;
	backendDistribution: Array<{ name: string; value: number }>;
	databaseDistribution: Array<{ name: string; value: number }>;
	ormDistribution: Array<{ name: string; value: number }>;
	dbSetupDistribution: Array<{ name: string; value: number }>;
	apiDistribution: Array<{ name: string; value: number }>;
	frontendDistribution: Array<{ name: string; value: number }>;
	nodeVersionDistribution: Array<{ version: string; count: number }>;
	cliVersionDistribution: Array<{ version: string; count: number }>;
	authDistribution: Array<{ name: string; value: number }>;
	gitDistribution: Array<{ name: string; value: number }>;
	installDistribution: Array<{ name: string; value: number }>;
	examplesDistribution: Array<{ name: string; value: number }>;
	addonsDistribution: Array<{ name: string; value: number }>;
	runtimeDistribution: Array<{ name: string; value: number }>;
	projectTypeDistribution: Array<{ name: string; value: number }>;
	webDeployDistribution: Array<{ name: string; value: number }>;
	serverDeployDistribution: Array<{ name: string; value: number }>;
	popularStackCombinations: Array<{ name: string; value: number }>;
	databaseORMCombinations: Array<{ name: string; value: number }>;
	hourlyDistribution: Array<{
		hour: string;
		displayHour: string;
		count: number;
	}>;
	summary: {
		totalProjects: number;
		avgProjectsPerDay: number;
		authEnabledPercent: number;
		mostPopularFrontend: string;
		mostPopularBackend: string;
		mostPopularORM: string;
		mostPopularAPI: string;
		mostPopularPackageManager: string;
		mostPopularWebDeploy: string;
		mostPopularServerDeploy: string;
	};
}

async function generateAnalyticsData() {
	try {
		console.log("🔄 Fetching analytics data...");

		const response = await fetch("https://r2.better-t-stack.dev/export.csv");
		let csvText = await response.text();

		// Fix malformed CSV data - if it's all on one line, try to split it properly
		if (!csvText.includes("\n") || csvText.split("\n").length < 3) {
			console.log("⚠️  Detected malformed CSV data, attempting to fix...");

			// Try to split by common patterns that indicate row boundaries
			const possibleSplitters = [
				/\s{3,}/, // 3 or more spaces
				/\s{2,}0{8,}/, // 2+ spaces followed by 8+ zeros (UUID pattern)
				/\s{2,}[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, // UUID pattern
			];

			for (const splitter of possibleSplitters) {
				const parts = csvText.split(splitter);
				if (parts.length > 2) {
					console.log(`✅ Fixed CSV using pattern: ${splitter}`);
					csvText = parts.join("\n");
					break;
				}
			}

			// If still malformed, try manual parsing
			if (!csvText.includes("\n") || csvText.split("\n").length < 3) {
				console.log("⚠️  CSV still malformed, attempting manual parsing...");

				// Extract header and data manually
				const headerMatch = csvText.match(/^([^,]+(?:,[^,]+)*)/);
				if (headerMatch) {
					const header = headerMatch[1];
					const dataPart = csvText.substring(header.length);

					// Split data by UUID patterns
					const dataRows = dataPart
						.split(
							/\s{2,}[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/,
						)
						.filter((row) => row.trim().length > 0)
						.map((row) => row.trim());

					csvText = `${header}\n${dataRows.join("\n")}`;
					console.log(`✅ Manually parsed ${dataRows.length} rows`);
				}
			}
		}

		console.log("📊 Processing CSV data...");

		let totalRecords = 0;
		const dateCounts: Record<string, number> = {};
		const monthlyCounts: Record<string, number> = {};
		const platformCounts: Record<string, number> = {};
		const packageManagerCounts: Record<string, number> = {};
		const backendCounts: Record<string, number> = {};
		const databaseCounts: Record<string, number> = {};
		const ormCounts: Record<string, number> = {};
		const dbSetupCounts: Record<string, number> = {};
		const apiCounts: Record<string, number> = {};
		const frontendCounts: Record<string, number> = {};
		const nodeVersionCounts: Record<string, number> = {};
		const cliVersionCounts: Record<string, number> = {};
		const authCounts: Record<string, number> = {};
		const gitCounts: Record<string, number> = {};
		const installCounts: Record<string, number> = {};
		const examplesCounts: Record<string, number> = {};
		const addonsCounts: Record<string, number> = {};
		const runtimeCounts: Record<string, number> = {};
		const projectTypeCounts: Record<string, number> = {};
		const webDeployCounts: Record<string, number> = {};
		const serverDeployCounts: Record<string, number> = {};
		const stackComboCounts: Record<string, number> = {};
		const dbORMComboCounts: Record<string, number> = {};
		const hourlyCounts: Record<number, number> = {};
		let authEnabledCount = 0;

		Papa.parse<CSVRow>(csvText, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				try {
					console.log("📈 Processing", results.data.length, "rows...");
					console.log(
						"📋 Sample row keys:",
						Object.keys(results.data[0] || {}),
					);

					results.data.forEach((row, index) => {
						// Skip rows that don't have essential data
						if (!row["*.timestamp"] && !row.timestamp) {
							if (index < 5) {
								console.log(
									`⚠️  Skipping row ${index} - no timestamp:`,
									Object.keys(row),
								);
							}
							return;
						}

						const timestamp =
							row["*.timestamp"] || row.timestamp || new Date().toISOString();
						const date = timestamp.includes("T")
							? timestamp.split("T")[0]
							: timestamp.split(" ")[0];

						// Skip invalid records
						if (!date || row["*.properties.platform"] === "unknown") {
							if (index < 5) {
								console.log(
									`⚠️  Skipping row ${index} - invalid date or platform:`,
									{ date, platform: row["*.properties.platform"] },
								);
							}
							return;
						}

						totalRecords++;

						// Time series data
						dateCounts[date] = (dateCounts[date] || 0) + 1;

						const timestampDate = new Date(timestamp);
						if (!Number.isNaN(timestampDate.getTime())) {
							const monthKey = `${timestampDate.getFullYear()}-${String(timestampDate.getMonth() + 1).padStart(2, "0")}`;
							monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;

							// Use UTC hours for consistent timezone handling
							const hour = timestampDate.getUTCHours();
							hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
						}

						// Platform
						const platform = row["*.properties.platform"] || "unknown";
						platformCounts[platform] = (platformCounts[platform] || 0) + 1;

						// Package manager
						const pm = row["*.properties.packageManager"] || "unknown";
						packageManagerCounts[pm] = (packageManagerCounts[pm] || 0) + 1;

						// Backend
						const backend = row["*.properties.backend"] || "none";
						backendCounts[backend] = (backendCounts[backend] || 0) + 1;

						// Database
						const database = row["*.properties.database"] || "none";
						databaseCounts[database] = (databaseCounts[database] || 0) + 1;

						// ORM
						const orm = row["*.properties.orm"] || "none";
						ormCounts[orm] = (ormCounts[orm] || 0) + 1;

						// DB Setup
						const dbSetup = row["*.properties.dbSetup"] || "none";
						dbSetupCounts[dbSetup] = (dbSetupCounts[dbSetup] || 0) + 1;

						// API
						const api = row["*.properties.api"] || "none";
						apiCounts[api] = (apiCounts[api] || 0) + 1;

						// Frontend
						const frontend0 = row["*.properties.frontend.0"] || "";
						const frontend1 = row["*.properties.frontend.1"] || "";
						if (frontend0 && frontend0 !== "none" && frontend0 !== "") {
							frontendCounts[frontend0] = (frontendCounts[frontend0] || 0) + 1;
						}
						if (frontend1 && frontend1 !== "none" && frontend1 !== "") {
							frontendCounts[frontend1] = (frontendCounts[frontend1] || 0) + 1;
						}

						// Node version
						const nodeVersion = row["*.properties.node_version"] || "unknown";
						const majorVersion = nodeVersion.replace(/^v/, "").split(".")[0];
						nodeVersionCounts[majorVersion] =
							(nodeVersionCounts[majorVersion] || 0) + 1;

						// CLI version
						const cliVersion = row["*.properties.cli_version"] || "unknown";
						cliVersionCounts[cliVersion] =
							(cliVersionCounts[cliVersion] || 0) + 1;

						const auth =
							row["*.properties.auth"] === "True" ? "enabled" : "disabled";
						authCounts[auth] = (authCounts[auth] || 0) + 1;
						if (auth === "enabled") authEnabledCount++;

						const git =
							row["*.properties.git"] === "True" ? "enabled" : "disabled";
						gitCounts[git] = (gitCounts[git] || 0) + 1;

						const install =
							row["*.properties.install"] === "True" ? "enabled" : "disabled";
						installCounts[install] = (installCounts[install] || 0) + 1;

						const examples = [
							row["*.properties.examples.0"],
							row["*.properties.examples.1"],
						].filter(Boolean);
						if (examples.length === 0) {
							examplesCounts.none = (examplesCounts.none || 0) + 1;
						} else {
							for (const example of examples) {
								examplesCounts[example] = (examplesCounts[example] || 0) + 1;
							}
						}

						const addons = [
							row["*.properties.addons.0"],
							row["*.properties.addons.1"],
							row["*.properties.addons.2"],
							row["*.properties.addons.3"],
							row["*.properties.addons.4"],
							row["*.properties.addons.5"],
						].filter(Boolean);
						if (addons.length === 0) {
							addonsCounts.none = (addonsCounts.none || 0) + 1;
						} else {
							for (const addon of addons) {
								addonsCounts[addon] = (addonsCounts[addon] || 0) + 1;
							}
						}

						const runtime = row["*.properties.runtime"] || "unknown";
						runtimeCounts[runtime] = (runtimeCounts[runtime] || 0) + 1;

						const webDeploy = row["*.properties.webDeploy"] || "none";
						const normalizedWebDeploy =
							webDeploy === "workers" ? "wrangler" : webDeploy;
						webDeployCounts[normalizedWebDeploy] =
							(webDeployCounts[normalizedWebDeploy] || 0) + 1;

						const serverDeploy = row["*.properties.serverDeploy"] || "none";
						serverDeployCounts[serverDeploy] =
							(serverDeployCounts[serverDeploy] || 0) + 1;

						const hasFrontend =
							(frontend0 && frontend0 !== "none") ||
							(frontend1 && frontend1 !== "none");
						const hasBackend = backend && backend !== "none";
						let type: string;
						if (hasFrontend && hasBackend) {
							type = "fullstack";
						} else if (hasFrontend && !hasBackend) {
							type = "frontend-only";
						} else if (!hasFrontend && hasBackend) {
							type = "backend-only";
						} else {
							type = "none";
						}
						projectTypeCounts[type] = (projectTypeCounts[type] || 0) + 1;

						const frontends = [frontend0, frontend1].filter(
							(f) => f && f !== "none" && f !== "",
						);
						const parts = [...frontends];
						if (backend !== "none") {
							parts.push(backend);
						}
						const combo = parts.length > 0 ? parts.join(" + ") : "none";
						stackComboCounts[combo] = (stackComboCounts[combo] || 0) + 1;

						if (database !== "none" && orm !== "none") {
							const combo = `${database} + ${orm}`;
							dbORMComboCounts[combo] = (dbORMComboCounts[combo] || 0) + 1;
						}
					});

					console.log(
						"✅ Successfully processed",
						totalRecords,
						"valid records",
					);
					console.log("📊 Platform distribution:", platformCounts);
					console.log("📊 Backend distribution:", backendCounts);
					console.log("📊 Database distribution:", databaseCounts);
				} catch (error) {
					console.error("Error parsing CSV:", error);
				}
			},
			error: (error: unknown) => {
				console.error("Papa Parse error:", error);
			},
		});

		// Get last updated timestamp
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

		// Process time series data
		const dates = Object.keys(dateCounts).sort();
		const startDate = new Date(dates[0]);
		const endDate = new Date(dates[dates.length - 1]);
		const today = new Date();
		const actualEndDate = endDate > today ? today : endDate;
		const daysDiff = Math.ceil(
			(actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		const maxDays = 60;

		let finalStartDate = startDate;
		if (daysDiff > maxDays) {
			finalStartDate = new Date(
				actualEndDate.getTime() - maxDays * 24 * 60 * 60 * 1000,
			);
		}

		const timeSeries: Array<{
			date: string;
			displayDate: string;
			count: number;
		}> = [];
		const currentDate = new Date(finalStartDate);
		while (currentDate <= actualEndDate) {
			const dateStr = currentDate.toISOString().split("T")[0];
			timeSeries.push({
				date: dateStr,
				displayDate: currentDate.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				count: dateCounts[dateStr] || 0,
			});
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Calculate summary stats
		const uniqueDates = new Set(Object.keys(dateCounts));
		const daysCovered = uniqueDates.size;
		const avgProjectsPerDay = daysCovered > 0 ? totalRecords / daysCovered : 0;
		const authEnabledPercent =
			totalRecords > 0
				? Math.round((authEnabledCount / totalRecords) * 100)
				: 0;

		// Get most popular items
		const getMostPopular = (counts: Record<string, number>) => {
			return (
				Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
			);
		};

		const analyticsData: AggregatedAnalyticsData = {
			lastUpdated,
			generatedAt: new Date().toISOString(),
			totalRecords,
			timeSeries,
			monthlyTimeSeries: Object.entries(monthlyCounts)
				.map(([month, count]) => ({
					month,
					displayMonth: new Date(`${month}-01`).toLocaleDateString("en-US", {
						month: "short",
						year: "numeric",
					}),
					count,
				}))
				.sort((a, b) => a.month.localeCompare(b.month)),
			platformDistribution: Object.entries(platformCounts).map(
				([name, value]) => ({ name, value }),
			),
			packageManagerDistribution: Object.entries(packageManagerCounts).map(
				([name, value]) => ({ name, value }),
			),
			backendDistribution: Object.entries(backendCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			databaseDistribution: Object.entries(databaseCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			ormDistribution: Object.entries(ormCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			dbSetupDistribution: Object.entries(dbSetupCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			apiDistribution: Object.entries(apiCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			frontendDistribution: Object.entries(frontendCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			nodeVersionDistribution: Object.entries(nodeVersionCounts)
				.map(([version, count]) => ({ version, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5),
			cliVersionDistribution: Object.entries(cliVersionCounts)
				.map(([version, count]) => ({ version, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 8),
			authDistribution: Object.entries(authCounts).map(([name, value]) => ({
				name,
				value,
			})),
			gitDistribution: Object.entries(gitCounts).map(([name, value]) => ({
				name,
				value,
			})),
			installDistribution: Object.entries(installCounts).map(
				([name, value]) => ({ name, value }),
			),
			examplesDistribution: Object.entries(examplesCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			addonsDistribution: Object.entries(addonsCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			runtimeDistribution: Object.entries(runtimeCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value),
			// Compare only actual deployment platforms (exclude "none")
			webDeployDistribution: [
				{ name: "wrangler", value: webDeployCounts.wrangler || 0 },
				{ name: "alchemy", value: webDeployCounts.alchemy || 0 },
			].sort((a, b) => b.value - a.value),
			serverDeployDistribution: [
				{ name: "wrangler", value: serverDeployCounts.wrangler || 0 },
				{ name: "alchemy", value: serverDeployCounts.alchemy || 0 },
			].sort((a, b) => b.value - a.value),

			projectTypeDistribution: Object.entries(projectTypeCounts).map(
				([name, value]) => ({ name, value }),
			),
			popularStackCombinations: Object.entries(stackComboCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value)
				.slice(0, 8),
			databaseORMCombinations: Object.entries(dbORMComboCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value)
				.slice(0, 6),
			hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
				hour: hour.toString().padStart(2, "0"),
				displayHour: `${hour.toString().padStart(2, "0")}:00`,
				count: hourlyCounts[hour] || 0,
			})),
			summary: {
				totalProjects: totalRecords,
				avgProjectsPerDay,
				authEnabledPercent,
				mostPopularFrontend: getMostPopular(frontendCounts),
				mostPopularBackend: getMostPopular(backendCounts),
				mostPopularORM: getMostPopular(ormCounts),
				mostPopularAPI: getMostPopular(apiCounts),
				mostPopularPackageManager: getMostPopular(packageManagerCounts),
				mostPopularWebDeploy: getMostPopular(webDeployCounts),
				mostPopularServerDeploy: getMostPopular(serverDeployCounts),
			},
		};

		console.log("📤 Creating minimal analytics file...");

		// Create minimal analytics data for public folder
		const minimalAnalyticsData = {
			totalProjects: totalRecords,
			avgProjectsPerDay: avgProjectsPerDay.toFixed(1),
			lastUpdated: lastUpdated,
		};

		console.log("📤 Uploading to Cloudflare R2...");

		const tempDir = mkdtempSync(join(tmpdir(), "analytics-"));
		const tempFilePath = join(tempDir, "analytics-data.json");
		const minimalTempFilePath = join(tempDir, "analytics-minimal.json");

		writeFileSync(tempFilePath, JSON.stringify(analyticsData, null, 2));
		writeFileSync(
			minimalTempFilePath,
			JSON.stringify(minimalAnalyticsData, null, 2),
		);

		const BUCKET_NAME = "bucket";
		const key = "analytics-data.json";
		const minimalKey = "analytics-minimal.json";
		const cmd = `npx wrangler r2 object put "${BUCKET_NAME}/${key}" --file="${tempFilePath}" --remote`;
		const minimalCmd = `npx wrangler r2 object put "${BUCKET_NAME}/${minimalKey}" --file="${minimalTempFilePath}" --remote`;

		console.log(`Uploading ${tempFilePath} to r2://${BUCKET_NAME}/${key} ...`);
		try {
			execSync(cmd, { stdio: "inherit" });
		} catch (err) {
			console.error("Failed to upload analytics data:", err);
			throw err;
		}

		console.log(
			`Uploading ${minimalTempFilePath} to r2://${BUCKET_NAME}/${minimalKey} ...`,
		);
		try {
			execSync(minimalCmd, { stdio: "inherit" });
		} catch (err) {
			console.error("Failed to upload minimal analytics data:", err);
			throw err;
		}

		console.log(
			`✅ Generated optimized analytics data with ${totalRecords} records`,
		);
		console.log(
			"📁 Uploaded minimal analytics file to R2: bucket/analytics-minimal.json",
		);
		console.log("📤 Uploaded to R2 bucket: bucket/analytics-data.json");
		console.log(`🕒 Last data update: ${lastUpdated}`);
		console.log(
			"📊 File size optimized: Pre-aggregated data instead of individual records",
		);
	} catch (error) {
		console.error("❌ Error generating analytics data:", error);
		process.exit(1);
	}
}

if (process.argv[1]?.endsWith("generate-analytics.ts")) {
	await generateAnalyticsData();
}

export { generateAnalyticsData };
